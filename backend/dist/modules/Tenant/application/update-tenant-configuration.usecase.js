import AppError from "../../../shared/errors/AppError.js";
import { UniqueConstraintError } from "../../../shared/db/database/errors/UniqueConstraintError.js";
export class UpdateTenantConfigurationUseCase {
    tenantRepository;
    createAuditLogUseCase;
    constructor(tenantRepository, createAuditLogUseCase) {
        this.tenantRepository = tenantRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(tenantId, data) {
        try {
            const existing = await this.tenantRepository.findById(tenantId);
            if (!existing) {
                throw new AppError("Tenant not found", "NOT_FOUND", 404);
            }
            if (data.slug && data.slug !== existing.slug) {
                const slugExists = await this.tenantRepository.findBySlug(data.slug);
                if (slugExists && slugExists.id !== tenantId) {
                    throw new AppError("Slug is already in use by another institution", "SLUG_ALREADY_EXISTS", 400);
                }
            }
            const updated = await this.tenantRepository.updateConfiguration(tenantId, data);
            await this.createAuditLogUseCase.execute({
                action: 'UPDATE',
                resource: 'TENANT',
                resourceId: tenantId,
                details: { updatedFields: Object.keys(data) }
            }).catch(err => console.error("Failed to create audit log for tenant configuration update", err));
            return updated;
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new AppError("Slug is already in use by another institution", "SLUG_ALREADY_EXISTS", 400);
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error updating tenant configuration", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=update-tenant-configuration.usecase.js.map