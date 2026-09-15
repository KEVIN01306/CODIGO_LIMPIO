import type { TenantRepository } from "../domain/tenant.repository.js";
import type { SebConfiguration } from "../domain/tenant.entity.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

export class UpdateSebConfigUseCase {
    constructor(
        private readonly tenantRepository: TenantRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) {}

    async execute(tenantId: string, defaultSebConfigKey: string | null): Promise<SebConfiguration> {
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
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error updating SEB configuration", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
