import type { TenantRepository } from "../domain/tenant.repository.js";
import type { TenantConfiguration } from "../domain/tenant.entity.js";
import AppError from "@shared/errors/AppError.js";

export class GetTenantConfigurationUseCase {
    constructor(private readonly tenantRepository: TenantRepository) {}

    async execute(tenantId: string): Promise<TenantConfiguration> {
        const tenant = await this.tenantRepository.findById(tenantId);
        if (!tenant) {
            throw new AppError("Tenant not found", "NOT_FOUND", 404);
        }

        return {
            id: tenant.id,
            slug: tenant.slug,
            name: tenant.name,
            isActive: tenant.isActive,
            createdAt: tenant.createdAt,
            updatedAt: tenant.updatedAt
        };
    }
}
