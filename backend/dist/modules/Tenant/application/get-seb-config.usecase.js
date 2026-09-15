import AppError from "../../../shared/errors/AppError.js";
export class GetSebConfigUseCase {
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
            defaultSebConfigKey: tenant.defaultSebConfigKey
        };
    }
}
//# sourceMappingURL=get-seb-config.usecase.js.map