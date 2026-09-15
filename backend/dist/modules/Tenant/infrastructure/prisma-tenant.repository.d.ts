import type { PrismaClient } from "@prisma/client";
import type { TenantRepository } from "../domain/tenant.repository.js";
import type { Tenant, TenantConfiguration, UpdateTenantConfiguration, SebConfiguration } from "../domain/tenant.entity.js";
export declare class PrismaTenantRepository implements TenantRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findById(id: string): Promise<Tenant | null>;
    findBySlug(slug: string): Promise<Tenant | null>;
    updateConfiguration(id: string, data: UpdateTenantConfiguration): Promise<TenantConfiguration>;
    updateSebConfig(id: string, defaultSebConfigKey: string | null): Promise<SebConfiguration>;
}
//# sourceMappingURL=prisma-tenant.repository.d.ts.map