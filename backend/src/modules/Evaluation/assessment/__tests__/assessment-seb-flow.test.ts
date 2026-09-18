import assert from "node:assert/strict";
import { SebJwtProvider } from "@shared/infrastructure/seb-jwt.provider.js";
import { resolveSebConfiguration } from "../domain/resolve-seb-config.helper.js";
import { StartAssessmentUseCase } from "../application/start-assessment.usecase.js";
import { CreateAssessmentUseCase } from "../application/create-assessment.usecase.js";
import { UpdateAssessmentUseCase } from "../application/update-assessment.usecase.js";
import { SebDownloadController } from "../presentation/seb-download.controller.js";
import AppError from "@shared/errors/AppError.js";

async function runTests() {
    console.log("=== Starting Assessment Start & SEB Verification Tests ===");

    process.env.SEB_JWT_SECRET = "test_seb_jwt_secret_key_32_characters_minimum";
    process.env.SEB_LAUNCH_BASE_URL = "seb://localhost:8001/seb/config";

    const sebJwtProvider = new SebJwtProvider();

    // ----------------------------------------------------
    // TEST 1: SEB JWT generation and claims
    // ----------------------------------------------------
    console.log("\nTest 1: SEB JWT generation and cryptographic verification");
    const testPayload = {
        submissionId: "sub-123",
        assessmentId: "asm-456",
        studentId: "std-789",
    };

    const token = await sebJwtProvider.generateToken(testPayload);
    assert(typeof token === "string" && token.length > 20, "Token should be a valid non-empty string");

    const verified = await sebJwtProvider.verifyToken(token);
    assert.equal(verified.submissionId, testPayload.submissionId);
    assert.equal(verified.assessmentId, testPayload.assessmentId);
    assert.equal(verified.studentId, testPayload.studentId);
    assert(verified.iat <= Math.floor(Date.now() / 1000));
    assert(verified.exp > verified.iat);
    // Expiration should be approximately 3 minutes (180s)
    const ttlSeconds = verified.exp - verified.iat;
    assert.equal(ttlSeconds, 180, `TTL should be 180 seconds, got ${ttlSeconds}`);
    console.log("✓ SEB JWT signed with 3m TTL and verified successfully");

    // ----------------------------------------------------
    // TEST 2: Tampered / wrong secret token rejection
    // ----------------------------------------------------
    console.log("\nTest 2: Tampered token rejection");
    const tamperedToken = token.slice(0, -5) + "abcde";
    await assert.rejects(
        () => sebJwtProvider.verifyToken(tamperedToken),
        (err: any) => err.code === "INVALID_SEB_TOKEN",
        "Tampered token should be rejected"
    );
    console.log("✓ Tampered token properly rejected with INVALID_SEB_TOKEN");

    // ----------------------------------------------------
    // TEST 3: resolveSebConfiguration helper
    // ----------------------------------------------------
    console.log("\nTest 3: Configuration resolution precedence");
    // Case A: Assessment has config -> returns assessment config
    const resAssessment = resolveSebConfiguration(
        { sebConfigKey: "asm-key", sebConfigFilePath: "https://r2/asm.seb" },
        { defaultSebConfigKey: "tenant-key", defaultSebConfigFilePath: "https://r2/tenant.seb" }
    );
    assert.deepEqual(resAssessment, {
        sebConfigKey: "asm-key",
        sebConfigUrl: "https://r2/asm.seb",
        source: "assessment",
    });
    console.log("✓ Assessment config takes precedence over Tenant default");

    // Case B: Assessment config empty -> falls back to Tenant default
    const resTenant = resolveSebConfiguration(
        { sebConfigKey: null, sebConfigFilePath: null },
        { defaultSebConfigKey: "tenant-key", defaultSebConfigFilePath: "https://r2/tenant.seb" }
    );
    assert.deepEqual(resTenant, {
        sebConfigKey: "tenant-key",
        sebConfigUrl: "https://r2/tenant.seb",
        source: "tenant",
    });
    console.log("✓ Falls back to Tenant default when Assessment config is empty");

    // Case C: Neither exists -> returns null
    const resNone = resolveSebConfiguration(
        { sebConfigKey: null, sebConfigFilePath: null },
        { defaultSebConfigKey: null, defaultSebConfigFilePath: null }
    );
    assert.equal(resNone, null);
    console.log("✓ Returns null when neither Assessment nor Tenant config exists");

    // ----------------------------------------------------
    // TEST 4: CreateAssessmentUseCase with strictMode & Tenant fallback
    // ----------------------------------------------------
    console.log("\nTest 4: Assessment creation strictMode rules");
    const mockRepo: any = {
        getOfferingTenantId: async () => "tenant-1",
        create: async (data: any) => ({ id: "asm-new", ...data }),
        update: async (id: string, data: any) => ({ id, ...data }),
        delete: async () => {},
    };
    const mockStorage: any = {
        upload: async () => ({ key: "k", url: "https://r2/k.seb" }),
        delete: async () => {},
        extractKeyFromUrl: (u: string) => u.split("/").pop() || "",
        getFile: async () => ({ buffer: Buffer.from("fake-seb-content"), contentType: "application/seb" }),
    };

    // Case A: strictMode = false -> requireSeb = false
    const mockTenantRepoWithSeb: any = {
        findById: async () => ({ id: "tenant-1", defaultSebConfigKey: "t-key", defaultSebConfigFilePath: "https://r2/t.seb" }),
    };
    const createUseCase = new CreateAssessmentUseCase(mockRepo, mockStorage, mockTenantRepoWithSeb);
    const nonStrict = await createUseCase.execute({
        offeringId: "off-1",
        title: "Normal Exam",
        type: "EXAM",
        maxScore: 100,
        strictMode: false,
    });
    assert.equal(nonStrict.requireSeb, false);
    assert.equal(nonStrict.strictMode, false);
    console.log("✓ strictMode = false produces requireSeb = false");

    // Case B: strictMode = true with tenant fallback (no file or key provided)
    const strictWithFallback = await createUseCase.execute({
        offeringId: "off-1",
        title: "Strict Exam using Tenant Default",
        type: "EXAM",
        maxScore: 100,
        strictMode: true,
    });
    assert.equal(strictWithFallback.strictMode, true);
    assert.equal(strictWithFallback.requireSeb, true);
    assert.equal(strictWithFallback.sebConfigKey, null);
    assert.equal(strictWithFallback.sebConfigFilePath, null);
    console.log("✓ strictMode = true without assessment config uses tenant fallback and sets requireSeb = true");

    // Case C: strictMode = true but tenant has NO default SEB config -> throws SEB_CONFIG_REQUIRED
    const mockTenantRepoNoSeb: any = {
        findById: async () => ({ id: "tenant-1", defaultSebConfigKey: null, defaultSebConfigFilePath: null }),
    };
    const createUseCaseNoTenantSeb = new CreateAssessmentUseCase(mockRepo, mockStorage, mockTenantRepoNoSeb);
    await assert.rejects(
        () => createUseCaseNoTenantSeb.execute({
            offeringId: "off-1",
            title: "Strict Exam without SEB",
            type: "EXAM",
            maxScore: 100,
            strictMode: true,
        }),
        (err: any) => err.code === "SEB_CONFIG_REQUIRED" && err.statusCode === 400,
        "Should require SEB config when tenant has no default"
    );

    console.log("✓ strictMode = true rejects when neither tenant nor assessment has SEB config");

    // ----------------------------------------------------
    // TEST 5: StartAssessmentUseCase
    // ----------------------------------------------------
    console.log("\nTest 5: StartAssessmentUseCase flow");
    let submissionStore: any[] = [];
    const mockSubmissionRepo: any = {
        findByAssessmentAndStudent: async (assessmentId: string, studentId: string) => {
            return submissionStore.find(s => s.assessmentId === assessmentId && s.studentId === studentId) || null;
        },
        create: async (data: any) => {
            const newSub = { id: "sub-" + Math.random().toString(36).slice(2, 8), ...data, status: "IN_PROGRESS" };
            submissionStore.push(newSub);
            return newSub;
        },
    };

    const mockStudentRepo: any = {
        findByUserId: async (userId: string) => ({
            id: "std-profile-1",
            userId: "user-student-1",
            user: { id: "user-student-1", tenantId: "tenant-1" },
        }),
    };

    const mockEnrollmentRepo: any = {
        findByOfferingAndStudent: async () => ({ id: "enr-1", status: "ENROLLED" }),
    };

    const mockTenantRepo: any = {
        findById: async (id: string) => ({
            id: "tenant-1",
            defaultSebConfigKey: "ten-key",
            defaultSebConfigFilePath: "https://r2/ten.seb",
        }),
    };

    const mockAssessmentRepo: any = {
        findById: async (id: string) => {
            if (id === "asm-normal") {
                return {
                    id: "asm-normal",
                    offeringId: "off-1",
                    strictMode: false,
                    requireSeb: false,
                    offering: { campus: { tenantId: "tenant-1" } },
                };
            }
            if (id === "asm-seb") {
                return {
                    id: "asm-seb",
                    offeringId: "off-1",
                    strictMode: true,
                    requireSeb: true,
                    sebConfigKey: "custom-seb-key",
                    sebConfigFilePath: "https://r2/custom.seb",
                    offering: { campus: { tenantId: "tenant-1" } },
                };
            }
            if (id === "asm-seb-fallback") {
                return {
                    id: "asm-seb-fallback",
                    offeringId: "off-1",
                    strictMode: true,
                    requireSeb: true,
                    sebConfigKey: null,
                    sebConfigFilePath: null,
                    offering: { campus: { tenantId: "tenant-1" } },
                };
            }
            return null;
        },
        getOfferingTenantId: async () => "tenant-1",
    };

    const startUseCase = new StartAssessmentUseCase(
        mockAssessmentRepo,
        mockSubmissionRepo,
        mockStudentRepo,
        mockEnrollmentRepo,
        mockTenantRepo,
        sebJwtProvider
    );

    // Case A: Normal assessment (requireSeb = false)
    const normalStart = await startUseCase.execute("asm-normal", "user-student-1");
    assert.equal(normalStart.requiresSeb, false);
    assert(normalStart.redirectUrl.startsWith("/sandbox/"));
    assert.equal(normalStart.redirectUrl, `/sandbox/${normalStart.submissionId}`);
    console.log("✓ Normal assessment returns requiresSeb = false and /sandbox/:submissionId");

    // Test Idempotency: second start call returns same submission
    const normalStart2 = await startUseCase.execute("asm-normal", "user-student-1");
    assert.equal(normalStart2.submissionId, normalStart.submissionId);
    assert.equal(submissionStore.filter(s => s.assessmentId === "asm-normal").length, 1);
    console.log("✓ Repeated start calls return existing submission without creating duplicates");

    // Case B: SEB assessment with custom config
    const sebStart = await startUseCase.execute("asm-seb", "user-student-1");
    assert.equal(sebStart.requiresSeb, true);
    assert(sebStart.redirectUrl.startsWith("seb://localhost:8001/seb/config?token="));
    const tokenInUrl = new URL(sebStart.redirectUrl.replace("seb://", "http://")).searchParams.get("token");
    assert(tokenInUrl);
    const verifiedToken = await sebJwtProvider.verifyToken(tokenInUrl);
    assert.equal(verifiedToken.submissionId, sebStart.submissionId);
    assert.equal(verifiedToken.assessmentId, "asm-seb");
    assert.equal(verifiedToken.studentId, "std-profile-1");
    console.log("✓ SEB assessment returns requiresSeb = true and valid seb:// launch URL");

    // Case C: SEB assessment with tenant fallback
    const sebFallbackStart = await startUseCase.execute("asm-seb-fallback", "user-student-1");
    assert.equal(sebFallbackStart.requiresSeb, true);
    assert(sebFallbackStart.redirectUrl.startsWith("seb://localhost:8001/seb/config?token="));
    console.log("✓ SEB assessment with tenant fallback returns requiresSeb = true");

    // ----------------------------------------------------
    // TEST 6: SebDownloadController (/seb/config?token=...)
    // ----------------------------------------------------
    console.log("\nTest 6: SebDownloadController execution");
    const mockDownloadPrisma: any = {
        submission: {
            findUnique: async ({ where }: any) => {
                if (where.id === sebStart.submissionId) {
                    return {
                        id: sebStart.submissionId,
                        assessmentId: "asm-seb",
                        studentId: "std-profile-1",
                        assessment: {
                            id: "asm-seb",
                            sebConfigKey: "custom-seb-key",
                            sebConfigFilePath: "https://r2/custom.seb",
                            offering: { campus: { tenantId: "tenant-1" } },
                        },
                    };
                }
                return null;
            },
        },
        tenant: {
            findUnique: async () => ({
                id: "tenant-1",
                defaultSebConfigKey: "ten-key",
                defaultSebConfigFilePath: "https://r2/ten.seb",
            }),
        },
    };

    const downloadController = new SebDownloadController(sebJwtProvider, mockStorage, mockDownloadPrisma);

    let sentBuffer: Buffer | null = null;
    let sentHeaders: Record<string, any> = {};
    let sentCookies: Record<string, any> = {};
    let sentStatus: number = 0;

    const mockRes: any = {
        setHeader: (k: string, v: any) => { sentHeaders[k] = v; },
        cookie: (k: string, v: any) => { sentCookies[k] = v; },
        status: (s: number) => {
            sentStatus = s;
            return {
                send: (b: any) => { sentBuffer = b; },
            };
        },
    };

    await downloadController.downloadConfig(
        { query: { token: tokenInUrl } } as any,
        mockRes,
        (err) => { if (err) throw err; }
    );

    assert.equal(sentStatus, 200);
    assert.equal(sentHeaders["Content-Type"], "application/seb");
    assert.equal(sentHeaders["Content-Disposition"], 'attachment; filename="config.seb"');
    assert(sentBuffer !== null && Buffer.isBuffer(sentBuffer));
    assert.equal((sentBuffer as Buffer).toString(), "fake-seb-content");
    console.log("✓ SebDownloadController verified token, relationships, and returned .seb binary");


    // Test rejection on student/assessment mismatch
    const mismatchedToken = await sebJwtProvider.generateToken({
        submissionId: sebStart.submissionId,
        assessmentId: "asm-WRONG",
        studentId: "std-profile-1",
    });

    let nextError: any = null;
    await downloadController.downloadConfig(
        { query: { token: mismatchedToken } } as any,
        mockRes,
        (err) => { nextError = err; }
    );
    assert(nextError instanceof AppError);
    assert.equal(nextError.statusCode, 403);
    console.log("✓ SebDownloadController properly rejected mismatched token relationships");


    console.log("\n=== ALL 6 TEST SUITES PASSED PERFECTLY ===");
}

runTests().catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
});
