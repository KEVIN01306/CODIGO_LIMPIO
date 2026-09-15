export class PrismaRolesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRolesWithPermissions(tenantId) {
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
    async getAllPermissions() {
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
//# sourceMappingURL=prisma-roles.repository.js.map