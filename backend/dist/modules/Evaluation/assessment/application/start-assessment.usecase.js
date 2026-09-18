import { resolveSebConfiguration } from "../domain/resolve-seb-config.helper.js";
import AppError from "../../../../shared/errors/AppError.js";
export class StartAssessmentUseCase {
    assessmentRepo;
    submissionRepo;
    studentRepo;
    enrollmentRepo;
    tenantRepo;
    sebJwtProvider;
    constructor(assessmentRepo, submissionRepo, studentRepo, enrollmentRepo, tenantRepo, sebJwtProvider) {
        this.assessmentRepo = assessmentRepo;
        this.submissionRepo = submissionRepo;
        this.studentRepo = studentRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.tenantRepo = tenantRepo;
        this.sebJwtProvider = sebJwtProvider;
    }
    async execute(assessmentId, userId) {
        // 1. Resolve student profile from user ID via domain repository
        const studentProfile = await this.studentRepo.findByUserId(userId);
        if (!studentProfile) {
            throw new AppError("User is not authorized as a student", "FORBIDDEN", 403);
        }
        const studentId = studentProfile.id;
        // 2. Retrieve assessment via domain repository
        const assessment = await this.assessmentRepo.findById(assessmentId);
        if (!assessment) {
            throw new AppError("Assessment not found", "NOT_FOUND", 404);
        }
        // 3. Verify student enrollment in the assessment's course offering via domain repository
        const enrollment = await this.enrollmentRepo.findByOfferingAndStudent(assessment.offeringId, studentId);
        if (!enrollment || enrollment.status !== "ENROLLED") {
            throw new AppError("Student is not enrolled in this course offering", "FORBIDDEN", 403);
        }
        // 4. Resolve tenant for SEB configuration (from course offering campus)
        const assessmentTenantId = assessment.offering?.campus?.tenantId || (await this.assessmentRepo.getOfferingTenantId(assessment.offeringId));
        // 5. Resolve / create Submission (idempotent lifecycle) via domain repository
        const existingSubmission = await this.submissionRepo.findByAssessmentAndStudent(assessmentId, studentId);
        let submissionId;
        if (existingSubmission) {
            if (existingSubmission.status === "SUBMITTED" || existingSubmission.status === "EVALUATED") {
                throw new AppError("Assessment submission has already been completed", "SUBMISSION_ALREADY_COMPLETED", 400);
            }
            submissionId = existingSubmission.id;
        }
        else {
            const created = await this.submissionRepo.create({
                assessmentId,
                studentId,
            });
            submissionId = created.id;
        }
        // 6. Determine whether SEB is required
        const isStrictMode = Boolean(assessment.strictMode);
        const requireSebFlag = Boolean(assessment.requireSeb);
        if (!isStrictMode && !requireSebFlag) {
            return {
                requiresSeb: false,
                redirectUrl: `/sandbox/${submissionId}`,
                submissionId,
            };
        }
        // 7. Resolve Tenant via domain repository for fallback configuration
        const effectiveTenantId = assessmentTenantId || studentProfile.user?.tenantId;
        const tenant = effectiveTenantId
            ? await this.tenantRepo.findById(effectiveTenantId)
            : null;
        const resolvedConfig = resolveSebConfiguration(assessment, tenant);
        if (!resolvedConfig) {
            throw new AppError("SEB configuration is not available for this assessment", "SEB_CONFIG_MISSING", 400);
        }
        // 8. Generate short-lived SEB launch JWT
        const sebToken = await this.sebJwtProvider.generateToken({
            submissionId,
            assessmentId,
            studentId,
        });
        // 9. Construct SEB launch URL
        const launchBaseUrl = process.env.SEB_LAUNCH_BASE_URL || "seb://localhost:8000/seb/config";
        const redirectUrl = `${launchBaseUrl}?token=${sebToken}`;
        console.log(redirectUrl);
        return {
            requiresSeb: true,
            redirectUrl,
            submissionId,
        };
    }
}
//# sourceMappingURL=start-assessment.usecase.js.map