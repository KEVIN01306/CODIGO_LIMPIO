import type { Tenant, TenantConfiguration, UpdateTenantConfiguration, SebConfiguration } from "./tenant.entity.js";

export interface TenantRepository {
    findById(id: string): Promise<Tenant | null>;
    findBySlug(slug: string): Promise<Tenant | null>;
    updateConfiguration(id: string, data: UpdateTenantConfiguration): Promise<TenantConfiguration>;
    updateSebConfig(id: string, defaultSebConfigKey: string | null): Promise<SebConfiguration>;
}
