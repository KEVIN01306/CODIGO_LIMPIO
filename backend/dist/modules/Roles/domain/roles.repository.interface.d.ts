import type { RoleWithPermissions, PermissionItem } from "./roles.interface.js";
export interface IRolesRepository {
    getRolesWithPermissions(tenantId: string): Promise<RoleWithPermissions[]>;
    getAllPermissions(): Promise<PermissionItem[]>;
}
//# sourceMappingURL=roles.repository.interface.d.ts.map