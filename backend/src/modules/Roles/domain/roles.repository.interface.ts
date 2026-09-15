import type { RoleWithPermissions, PermissionItem } from "./roles.interface.js";

export interface IRolesRepository {
    getRolesWithPermissions(tenantId: string): Promise<RoleWithPermissions[]>;
    getAllPermissions(): Promise<PermissionItem[]>;
}
