import AppError from "../../../shared/errors/AppError.js";
export class GetTenantConfigurationUseCase {
    tenantRepository;
    constructor(tenantRepository) {
        this.tenantRepository = tenantRepository;
    }
    async execute(tenantId) {
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
//# sourceMappingURL=get-tenant-configuration.usecase.js.map