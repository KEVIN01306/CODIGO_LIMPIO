import AppError from "../../../shared/errors/AppError.js";
import { buildTenantSebPath } from "../../../shared/utils/seb-path.helper.js";
export class UpdateSebConfigUseCase {
    tenantRepository;
    storageProvider;
    createAuditLogUseCase;
    constructor(tenantRepository, storageProvider, createAuditLogUseCase) {
        this.tenantRepository = tenantRepository;
        this.storageProvider = storageProvider;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(tenantId, data, file) {
        try {
            const existing = await this.tenantRepository.findById(tenantId);
            if (!existing) {
                throw new AppError("Tenant not found", "NOT_FOUND", 404);
            }
            let updated;
            const updatedFields = [];
            if (file) {
                // Validate extension and MIME type
                const originalName = file.originalname.toLowerCase();
                if (!originalName.endsWith(".seb")) {
                    throw new AppError("Invalid file extension. Only .seb files are allowed.", "INVALID_FILE_EXTENSION", 400);
                }
                if (file.mimetype !== "application/seb") {
                    throw new AppError("Invalid MIME type. Expected application/seb.", "INVALID_MIME_TYPE", 400);
                }
                const r2Key = buildTenantSebPath(tenantId, file.originalname);
                // Upload to R2
                const uploadResult = await this.storageProvider.upload({
                    key: r2Key,
                    buffer: file.buffer,
                    mimeType: "application/seb",
                });
                // Persist new URL to database
                try {
                    updated = await this.tenantRepository.updateSebConfig(tenantId, {
                        defaultSebConfigKey: data.defaultSebConfigKey !== undefined ? data.defaultSebConfigKey : existing.defaultSebConfigKey,
                        defaultSebConfigFilePath: uploadResult.url,
                    });
                    updatedFields.push("defaultSebConfigFilePath");
                    if (data.defaultSebConfigKey !== undefined) {
                        updatedFields.push("defaultSebConfigKey");
                    }
                }
                catch (dbError) {
                    // Failure rollback: remove newly uploaded file from R2 if database update fails
                    await this.storageProvider.delete(uploadResult.key).catch((err) => console.error("Failed to delete newly uploaded R2 file after DB failure:", err));
                    throw dbError;
                }
                // Safe replacement: delete old file from R2 only AFTER database update succeeded
                if (existing.defaultSebConfigFilePath && existing.defaultSebConfigFilePath !== uploadResult.url) {
                    const oldKey = this.storageProvider.extractKeyFromUrl(existing.defaultSebConfigFilePath);
                    if (oldKey && oldKey !== uploadResult.key) {
                        await this.storageProvider.delete(oldKey).catch((err) => console.error("Failed to delete previous SEB file from R2:", err));
                    }
                }
            }
            else {
                updated = await this.tenantRepository.updateSebConfig(tenantId, {
                    defaultSebConfigKey: data.defaultSebConfigKey ?? null,
                });
                updatedFields.push("defaultSebConfigKey");
            }
            await this.createAuditLogUseCase
                .execute({
                action: "UPDATE",
                resource: "TENANT_SEB_CONFIG",
                resourceId: tenantId,
                details: { updatedFields },
            })
                .catch((err) => console.error("Failed to create audit log for SEB config update", err));
            return updated;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error updating SEB configuration", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=update-seb-config.usecase.js.map