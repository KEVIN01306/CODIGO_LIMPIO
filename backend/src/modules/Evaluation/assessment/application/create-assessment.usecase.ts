import { AssessmentRepository } from "../domain/assessment.repository.js";
import { CreateAssessmentDTO } from "../domain/assessment.interfaces.js";
import type { StorageProvider, UploadFileResult } from "@shared/domain/storage.provider.js";
import type { TenantRepository } from "@modules/Tenant/domain/tenant.repository.js";
import AppError from "@shared/errors/AppError.js";
import { buildAssessmentSebPath } from "@shared/utils/seb-path.helper.js";

export class CreateAssessmentUseCase {
    constructor(
        private readonly repository: AssessmentRepository,
        private readonly storageProvider: StorageProvider,
        private readonly tenantRepository?: TenantRepository
    ) { }

    async execute(data: CreateAssessmentDTO, file?: Express.Multer.File, tenantId?: string) {
        // Resolve tenant: prioritize offering's campus tenant, fallback to user's tenant
        const offeringTenantId = await this.repository.getOfferingTenantId(data.offeringId);
        const effectiveTenantId = offeringTenantId || tenantId;
        const isStrictMode = Boolean(data.strictMode);

        // Rule: strictMode = false -> requireSeb = false
        if (!isStrictMode) {
            return await this.repository.create({
                ...data,
                strictMode: false,
                requireSeb: false,
                sebConfigKey: null,
                sebConfigFilePath: null,
            });
        }

        // Rule: strictMode = true -> check Assessment configuration OR Tenant default configuration
        const key = data.sebConfigKey?.trim();
        const hasFile = Boolean(file);

        // Case 1: Assessment provides its own SEB config (file and/or key)
        if (hasFile || key) {
            if (!key) {
                throw new AppError("SEB key is required when providing a SEB configuration file", "SEB_KEY_REQUIRED", 400);
            }
            if (!file) {
                throw new AppError("SEB configuration file (.seb) is required when providing a SEB key", "SEB_FILE_REQUIRED", 400);
            }


        // Validate file extension and MIME type
        const originalName = file.originalname.toLowerCase();
        if (!originalName.endsWith(".seb")) {
            throw new AppError("Only .seb files are allowed.", "INVALID_FILE_EXTENSION", 400);
        }
        if (file.mimetype !== "application/seb") {
            throw new AppError("Invalid MIME type. Expected application/seb.", "INVALID_MIME_TYPE", 400);
        }

        if (!effectiveTenantId) {
            throw new AppError("Unable to determine tenant for assessment file storage", "TENANT_REQUIRED", 400);
        }

        // Step 1: Create initial assessment record in database to obtain assessmentId
        const created = await this.repository.create({
            ...data,
            strictMode: true,
            requireSeb: false,
            sebConfigKey: null,
            sebConfigFilePath: null,
        });

        // Step 2: Upload .seb file to R2 at {tenantId}/assessments/{assessmentId}/{fileName}.seb
        const r2Key = buildAssessmentSebPath(effectiveTenantId, created.id, file.originalname);
        let uploadResult: UploadFileResult;

        try {
            uploadResult = await this.storageProvider.upload({
                key: r2Key,
                buffer: file.buffer,
                mimeType: "application/seb",
            });
        } catch (uploadError) {
            // Rollback: delete created assessment from database so we don't leave partial state
            await this.repository.delete(created.id).catch((err) =>
                console.error("Failed to delete assessment after R2 upload error:", err)
            );
            throw uploadError;
        }

        // Step 3: Persist SEB configuration URL & set requireSeb = true
        try {
            const updated = await this.repository.update(created.id, {
                requireSeb: true,
                sebConfigKey: key,
                sebConfigFilePath: uploadResult.url,
            });

            if (!updated) {
                throw new AppError("Failed to update assessment with SEB configuration", "DATABASE_ERROR", 500);
            }

            return updated;
        } catch (dbError) {
                // Failure cleanup / rollback: delete newly uploaded file from R2
            await this.storageProvider.delete(uploadResult.key).catch((err) =>
                console.error("Failed to delete orphaned R2 file after DB update failure:", err)
            );
            // Delete created assessment
            await this.repository.delete(created.id).catch((err) =>
                console.error("Failed to delete assessment after DB update failure:", err)
            );
            throw dbError;
        }
    }

    // Case 2: Neither file nor key provided on Assessment -> check Tenant default SEB configuration
    if (!effectiveTenantId) {
        throw new AppError("Unable to determine tenant for assessment SEB configuration", "TENANT_REQUIRED", 400);
    }

    let tenant = this.tenantRepository
        ? await this.tenantRepository.findById(effectiveTenantId)
        : null;

    let tenantHasSeb = Boolean(tenant?.defaultSebConfigKey?.trim() && tenant?.defaultSebConfigFilePath?.trim());

    // Check user tenant as fallback if different
    if (!tenantHasSeb && this.tenantRepository && tenantId && tenantId !== effectiveTenantId) {
        const userTenant = await this.tenantRepository.findById(tenantId);
        if (userTenant?.defaultSebConfigKey?.trim() && userTenant?.defaultSebConfigFilePath?.trim()) {
            tenant = userTenant;
            tenantHasSeb = true;
        }
    }

    if (tenantHasSeb) {
        // strictMode = true, Tenant SEB config exists, Assessment SEB config empty -> requireSeb = true, use Tenant SEB config
        return await this.repository.create({
            ...data,
            strictMode: true,
            requireSeb: true,
            sebConfigKey: null,
            sebConfigFilePath: null,
        });
    }

    // Tenant SEB config unavailable and Assessment config empty -> rejection
    throw new AppError("SEB key and configuration file (.seb) are required when strictMode is enabled and tenant has no default SEB configuration", "SEB_CONFIG_REQUIRED", 400);
}
}

