import { PrismaErrorMapper } from "../../../shared/db/database/prisma/PrismaErrorMapper.js";
export class PrismaTenantRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        try {
            const tenant = await this.prisma.tenant.findUnique({
                where: { id }
            });
            if (!tenant)
                return null;
            return {
                id: tenant.id,
                slug: tenant.slug,
                name: tenant.name,
                isActive: tenant.isActive,
                createdAt: tenant.createdAt,
                updatedAt: tenant.updatedAt,
                defaultSebConfigKey: tenant.defaultSebConfigKey
            };
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findBySlug(slug) {
        try {
            const tenant = await this.prisma.tenant.findUnique({
                where: { slug }
            });
            if (!tenant)
                return null;
            return {
                id: tenant.id,
                slug: tenant.slug,
                name: tenant.name,
                isActive: tenant.isActive,
                createdAt: tenant.createdAt,
                updatedAt: tenant.updatedAt,
                defaultSebConfigKey: tenant.defaultSebConfigKey
            };
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async updateConfiguration(id, data) {
        try {
            const updated = await this.prisma.tenant.update({
                where: { id },
                data: {
                    ...(data.name !== undefined && { name: data.name }),
                    ...(data.slug !== undefined && { slug: data.slug }),
                    ...(data.isActive !== undefined && { isActive: data.isActive }),
                },
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            return updated;
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async updateSebConfig(id, defaultSebConfigKey) {
        try {
            const updated = await this.prisma.tenant.update({
                where: { id },
                data: {
                    defaultSebConfigKey
                },
                select: {
                    defaultSebConfigKey: true
                }
            });
            return updated;
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
//# sourceMappingURL=prisma-tenant.repository.js.map