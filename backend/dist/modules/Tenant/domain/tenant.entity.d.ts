export interface Tenant {
    id: string;
    slug: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    defaultSebConfigKey: string | null;
}
export interface TenantConfiguration {
    id: string;
    slug: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface UpdateTenantConfiguration {
    name?: string;
    slug?: string;
    isActive?: boolean;
}
export interface SebConfiguration {
    defaultSebConfigKey: string | null;
}
export interface UpdateSebConfiguration {
    defaultSebConfigKey: string | null;
}
//# sourceMappingURL=tenant.entity.d.ts.map