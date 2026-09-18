import AppError from "../../../../shared/errors/AppError.js";
import { buildAssessmentSebPath } from "../../../../shared/utils/seb-path.helper.js";
export class UpdateAssessmentUseCase {
    repository;
    storageProvider;
    tenantRepository;
    constructor(repository, storageProvider, tenantRepository) {
        this.repository = repository;
        this.storageProvider = storageProvider;
        this.tenantRepository = tenantRepository;
    }
    async execute(id, data, file, tenantId) {
        const existing = await this.repository.findById(id);
        if (!existing)
            throw new AppError('Assessment not found', 'NOT_FOUND', 404);
        const assessmentTenantId = existing.offering?.campus?.tenantId || (await this.repository.getOfferingTenantId(existing.offeringId));
        const effectiveTenantId = assessmentTenantId || tenantId;
        const newStrictMode = data.strictMode !== undefined ? Boolean(data.strictMode) : existing.strictMode;
        // If strictMode is explicitly disabled
        if (data.strictMode === false) {
            // Safe removal: if there was an existing SEB file, remove it from R2
            if (existing.sebConfigFilePath) {
                const oldKey = this.storageProvider.extractKeyFromUrl(existing.sebConfigFilePath);
                if (oldKey) {
                    await this.storageProvider.delete(oldKey).catch((err) => console.error("Failed to delete old SEB file on disabling strictMode:", err));
                }
            }
            const entity = await this.repository.update(id, {
                ...data,
                strictMode: false,
                requireSeb: false,
                sebConfigKey: null,
                sebConfigFilePath: null,
            });
            if (!entity)
                throw new AppError('Assessment not found', 'NOT_FOUND', 404);
            return entity;
        }
        // If strictMode is or becomes active
        if (newStrictMode) {
            let key = data.sebConfigKey !== undefined ? data.sebConfigKey?.trim() || null : existing.sebConfigKey;
            if (file) {
                // Validate file extension and MIME type
                const originalName = file.originalname.toLowerCase();
                if (!originalName.endsWith(".seb")) {
                    throw new AppError("Only .seb files are allowed.", "INVALID_FILE_EXTENSION", 400);
                }
                if (file.mimetype !== "application/seb") {
                    throw new AppError("Invalid MIME type. Expected application/seb.", "INVALID_MIME_TYPE", 400);
                }
                if (!key) {
                    throw new AppError("SEB key is required when strictMode is enabled", "SEB_KEY_REQUIRED", 400);
                }
                if (!effectiveTenantId) {
                    throw new AppError("Unable to determine tenant for assessment file storage", "TENANT_REQUIRED", 400);
                }
                const r2Key = buildAssessmentSebPath(effectiveTenantId, id, file.originalname);
                const uploadResult = await this.storageProvider.upload({
                    key: r2Key,
                    buffer: file.buffer,
                    mimeType: "application/seb",
                });
                try {
                    const entity = await this.repository.update(id, {
                        ...data,
                        strictMode: true,
                        requireSeb: true,
                        sebConfigKey: key,
                        sebConfigFilePath: uploadResult.url,
                    });
                    if (!entity)
                        throw new AppError('Assessment not found', 'NOT_FOUND', 404);
                    // Safe replacement: delete old file from R2 only AFTER database update succeeded
                    if (existing.sebConfigFilePath && existing.sebConfigFilePath !== uploadResult.url) {
                        const oldKey = this.storageProvider.extractKeyFromUrl(existing.sebConfigFilePath);
                        if (oldKey && oldKey !== uploadResult.key) {
                            await this.storageProvider.delete(oldKey).catch((err) => console.error("Failed to delete previous SEB file on assessment update:", err));
                        }
                    }
                    return entity;
                }
                catch (dbError) {
                    // Rollback newly uploaded file on DB error
                    await this.storageProvider.delete(uploadResult.key).catch((err) => console.error("Failed to delete new R2 file on update failure:", err));
                    throw dbError;
                }
            }
            else {
                // No new file uploaded
                // 1. Check if existing assessment already has both file and key
                if (existing.sebConfigFilePath && key) {
                    const entity = await this.repository.update(id, {
                        ...data,
                        strictMode: true,
                        requireSeb: true,
                        sebConfigKey: key,
                    });
                    if (!entity)
                        throw new AppError('Assessment not found', 'NOT_FOUND', 404);
                    return entity;
                }
                // 2. Otherwise check if Tenant default SEB configuration exists
                let tenant = this.tenantRepository && effectiveTenantId
                    ? await this.tenantRepository.findById(effectiveTenantId)
                    : null;
                let tenantHasSeb = Boolean(tenant?.defaultSebConfigKey?.trim() && tenant?.defaultSebConfigFilePath?.trim());
                if (!tenantHasSeb && this.tenantRepository && tenantId && tenantId !== effectiveTenantId) {
                    const userTenant = await this.tenantRepository.findById(tenantId);
                    if (userTenant?.defaultSebConfigKey?.trim() && userTenant?.defaultSebConfigFilePath?.trim()) {
                        tenant = userTenant;
                        tenantHasSeb = true;
                    }
                }
                if (tenantHasSeb) {
                    const entity = await this.repository.update(id, {
                        ...data,
                        strictMode: true,
                        requireSeb: true,
                        sebConfigKey: key || null,
                        sebConfigFilePath: existing.sebConfigFilePath || null,
                    });
                    if (!entity)
                        throw new AppError('Assessment not found', 'NOT_FOUND', 404);
                    return entity;
                }
                // 3. If neither Assessment nor Tenant has valid SEB config, enforce requirement
                if (!existing.sebConfigFilePath) {
                    throw new AppError("SEB configuration file (.seb) is required when strictMode is enabled and tenant has no default configuration", "SEB_FILE_REQUIRED", 400);
                }
                if (!key) {
                    throw new AppError("SEB key is required when strictMode is enabled", "SEB_KEY_REQUIRED", 400);
                }
                const entity = await this.repository.update(id, {
                    ...data,
                    strictMode: true,
                    requireSeb: true,
                    sebConfigKey: key,
                });
                if (!entity)
                    throw new AppError('Assessment not found', 'NOT_FOUND', 404);
                return entity;
            }
        }
        // Standard update when strictMode is not enabled
        const entity = await this.repository.update(id, data);
        if (!entity)
            throw new AppError('Assessment not found', 'NOT_FOUND', 404);
        return entity;
    }
}
//# sourceMappingURL=update-assessment.usecase.js.map