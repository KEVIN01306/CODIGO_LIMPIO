import type { TenantRepository } from "../domain/tenant.repository.js";
import type { SebConfiguration } from "../domain/tenant.entity.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
export declare class UpdateSebConfigUseCase {
    private readonly tenantRepository;
    private readonly createAuditLogUseCase;
    constructor(tenantRepository: TenantRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(tenantId: string, defaultSebConfigKey: string | null): Promise<SebConfiguration>;
}
//# sourceMappingURL=update-seb-config.usecase.d.ts.map