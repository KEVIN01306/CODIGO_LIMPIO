import AppError from "../../../shared/errors/AppError.js";
export class UpdateSebConfigUseCase {
    tenantRepository;
    createAuditLogUseCase;
    constructor(tenantRepository, createAuditLogUseCase) {
        this.tenantRepository = tenantRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(tenantId, defaultSebConfigKey) {
        try {
            const existing = await this.tenantRepository.findById(tenantId);
            if (!existing) {
                throw new AppError("Tenant not found", "NOT_FOUND", 404);
            }
            const updated = await this.tenantRepository.updateSebConfig(tenantId, defaultSebConfigKey);
            await this.createAuditLogUseCase.execute({
                action: 'UPDATE',
                resource: 'TENANT_SEB_CONFIG',
                resourceId: tenantId,
                details: { updatedFields: ['defaultSebConfigKey'] }
            }).catch(err => console.error("Failed to create audit log for SEB config update", err));
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