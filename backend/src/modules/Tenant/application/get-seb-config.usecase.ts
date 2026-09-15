import type { TenantRepository } from "../domain/tenant.repository.js";
import type { SebConfiguration } from "../domain/tenant.entity.js";
import AppError from "@shared/errors/AppError.js";

export class GetSebConfigUseCase {
    constructor(private readonly tenantRepository: TenantRepository) {}

    async execute(tenantId: string): Promise<SebConfiguration> {
        const tenant = await this.tenantRepository.findById(tenantId);
        if (!tenant) {
            throw new AppError("Tenant not found", "NOT_FOUND", 404);
        }

        return {
            defaultSebConfigKey: tenant.defaultSebConfigKey
        };
    }
}
