import type { TenantRepository } from "../domain/tenant.repository.js";
import type { SebConfiguration } from "../domain/tenant.entity.js";
import type { StorageProvider } from "../../../shared/domain/storage.provider.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
export declare class UpdateSebConfigUseCase {
    private readonly tenantRepository;
    private readonly storageProvider;
    private readonly createAuditLogUseCase;
    constructor(tenantRepository: TenantRepository, storageProvider: StorageProvider, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(tenantId: string, data: {
        defaultSebConfigKey?: string | null;
    }, file?: Express.Multer.File): Promise<SebConfiguration>;
}
//# sourceMappingURL=update-seb-config.usecase.d.ts.map