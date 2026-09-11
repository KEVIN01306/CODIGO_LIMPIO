import { PrismaErrorMapper } from "../../../shared/db/database/prisma/PrismaErrorMapper.js";
import { CampusMapper } from "./mappers/campus.mapper.js";
export class PrismaCampusesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            const campus = await this.prisma.campus.create({
                data: {
                    tenantId: data.tenantId,
                    code: data.code,
                    name: data.name,
                    address: data.address,
                }
            });
            return CampusMapper.toGetCampus(campus);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async update(id, data) {
        try {
            const campus = await this.prisma.campus.update({
                where: { id },
                data: {
                    code: data.code,
                    name: data.name,
                    address: data.address,
                    isActive: data.isActive
                }
            });
            return CampusMapper.toGetCampus(campus);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findById(id) {
        try {
            const campus = await this.prisma.campus.findUnique({
                where: { id }
            });
            return campus ? CampusMapper.toGetCampus(campus) : null;
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findByCode(tenantId, code) {
        try {
            const campus = await this.prisma.campus.findUnique({
                where: {
                    tenantId_code: {
                        tenantId,
                        code
                    }
                }
            });
            return campus ? CampusMapper.toDomain(campus) : null;
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findAll(page, perPage, filters) {
        try {
            const skip = (page - 1) * perPage;
            const where = {
                tenantId: filters.tenantId
            };
            if (filters.isActive !== undefined) {
                where.isActive = filters.isActive;
            }
            if (filters.q) {
                where.OR = [
                    { code: { contains: filters.q } },
                    { name: { contains: filters.q } }
                ];
            }
            const [total, items] = await Promise.all([
                this.prisma.campus.count({ where }),
                this.prisma.campus.findMany({
                    where,
                    skip,
                    take: perPage,
                    orderBy: { name: 'asc' }
                })
            ]);
            return {
                total,
                data: items.map(item => CampusMapper.toGetSimpleCampus(item))
            };
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async delete(id) {
        try {
            await this.prisma.campus.delete({
                where: { id }
            });
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
//# sourceMappingURL=prisma-campus.repository.js.map