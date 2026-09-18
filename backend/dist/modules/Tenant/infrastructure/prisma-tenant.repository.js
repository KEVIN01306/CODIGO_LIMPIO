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
                defaultSebConfigKey: tenant.defaultSebConfigKey,
                defaultSebConfigFilePath: tenant.defaultSebConfigFilePath
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
                defaultSebConfigKey: tenant.defaultSebConfigKey,
                defaultSebConfigFilePath: tenant.defaultSebConfigFilePath
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
    async updateSebConfig(id, data) {
        try {
            const updateData = {};
            if (data.defaultSebConfigKey !== undefined) {
                updateData.defaultSebConfigKey = data.defaultSebConfigKey;
            }
            if (data.defaultSebConfigFilePath !== undefined) {
                updateData.defaultSebConfigFilePath = data.defaultSebConfigFilePath;
            }
            const updated = await this.prisma.tenant.update({
                where: { id },
                data: updateData,
                select: {
                    defaultSebConfigKey: true,
                    defaultSebConfigFilePath: true
                }
            });
            return {
                defaultSebConfigKey: updated.defaultSebConfigKey,
                defaultSebConfigUrl: updated.defaultSebConfigFilePath,
                defaultSebConfigFilePath: updated.defaultSebConfigFilePath
            };
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
//# sourceMappingURL=prisma-tenant.repository.js.map