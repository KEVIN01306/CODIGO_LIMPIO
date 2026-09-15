import type { TenantRepository } from "../domain/tenant.repository.js";
import type { TenantConfiguration, UpdateTenantConfiguration } from "../domain/tenant.entity.js";
import AppError from "@shared/errors/AppError.js";
import { UniqueConstraintError } from "@shared/db/database/errors/UniqueConstraintError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

export class UpdateTenantConfigurationUseCase {
    constructor(
        private readonly tenantRepository: TenantRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) {}

    async execute(tenantId: string, data: UpdateTenantConfiguration): Promise<TenantConfiguration> {
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
        } catch (error) {
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
