import type { TenantRepository } from "../domain/tenant.repository.js";
import type { TenantConfiguration, UpdateTenantConfiguration } from "../domain/tenant.entity.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
export declare class UpdateTenantConfigurationUseCase {
    private readonly tenantRepository;
    private readonly createAuditLogUseCase;
    constructor(tenantRepository: TenantRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(tenantId: string, data: UpdateTenantConfiguration): Promise<TenantConfiguration>;
}
//# sourceMappingURL=update-tenant-configuration.usecase.d.ts.map