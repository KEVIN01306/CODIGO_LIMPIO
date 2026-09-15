import type { PrismaClient } from "@prisma/client";
import type { IRolesRepository } from "../domain/roles.repository.interface.js";
import type { RoleWithPermissions, PermissionItem } from "../domain/roles.interface.js";
export declare class PrismaRolesRepository implements IRolesRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    getRolesWithPermissions(tenantId: string): Promise<RoleWithPermissions[]>;
    getAllPermissions(): Promise<PermissionItem[]>;
}
//# sourceMappingURL=prisma-roles.repository.d.ts.map