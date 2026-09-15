import type { TenantRepository } from "../domain/tenant.repository.js";
import type { TenantConfiguration } from "../domain/tenant.entity.js";
export declare class GetTenantConfigurationUseCase {
    private readonly tenantRepository;
    constructor(tenantRepository: TenantRepository);
    execute(tenantId: string): Promise<TenantConfiguration>;
}
//# sourceMappingURL=get-tenant-configuration.usecase.d.ts.map