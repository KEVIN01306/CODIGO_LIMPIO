import type { PrismaClient } from "@prisma/client";
import type { IRolesRepository } from "../domain/roles.repository.interface.js";
import type { RoleWithPermissions, PermissionItem } from "../domain/roles.interface.js";

export class PrismaRolesRepository implements IRolesRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async getRolesWithPermissions(tenantId: string): Promise<RoleWithPermissions[]> {
        const roles = await this.prisma.role.findMany({
            where: {
                OR: [
                    { tenantId },
                    { tenantId: null }
                ]
            },
            include: {
                rolePermissions: {
                    include: {
                        permission: true
                    }
                }
            },
            orderBy: [
                { isSystem: 'desc' },
                { name: 'asc' }
            ]
        });

        return roles.map((role) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            isSystem: role.isSystem,
            permissions: role.rolePermissions
                .map((rp) => rp.permission.action)
                .filter(Boolean)
        }));
    }

    async getAllPermissions(): Promise<PermissionItem[]> {
        const permissions = await this.prisma.permission.findMany({
            orderBy: {
                action: 'asc'
            }
        });

        return permissions.map((p) => ({
            id: p.id,
            action: p.action,
            description: p.description
        }));
    }
}
