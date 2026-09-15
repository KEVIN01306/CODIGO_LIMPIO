import type { TenantRepository } from "../domain/tenant.repository.js";
import type { SebConfiguration } from "../domain/tenant.entity.js";
export declare class GetSebConfigUseCase {
    private readonly tenantRepository;
    constructor(tenantRepository: TenantRepository);
    execute(tenantId: string): Promise<SebConfiguration>;
}
//# sourceMappingURL=get-seb-config.usecase.d.ts.map