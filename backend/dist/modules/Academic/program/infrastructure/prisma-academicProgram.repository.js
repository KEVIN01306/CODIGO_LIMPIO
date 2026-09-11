import { PrismaErrorMapper } from "../../../../shared/db/database/prisma/PrismaErrorMapper.js";
import { AcademicProgramMapper } from "./mappers/academicProgram.mapper.js";
export class PrismaAcademicProgramsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            const program = await this.prisma.academicProgram.create({
                data: {
                    tenantId: data.tenantId,
                    code: data.code,
                    name: data.name
                }
            });
            return AcademicProgramMapper.toGetAcademicProgram(program);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async update(id, data) {
        try {
            const program = await this.prisma.academicProgram.update({
                where: { id },
                data: {
                    code: data.code,
                    name: data.name
                }
            });
            return AcademicProgramMapper.toGetAcademicProgram(program);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findById(id) {
        try {
            const program = await this.prisma.academicProgram.findUnique({
                where: { id }
            });
            return program ? AcademicProgramMapper.toGetAcademicProgram(program) : null;
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findByCode(tenantId, code) {
        try {
            const program = await this.prisma.academicProgram.findUnique({
                where: {
                    tenantId_code: {
                        tenantId,
                        code
                    }
                }
            });
            return program ? AcademicProgramMapper.toDomain(program) : null;
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
            if (filters.q) {
                where.OR = [
                    { code: { contains: filters.q } },
                    { name: { contains: filters.q } }
                ];
            }
            const [total, items] = await Promise.all([
                this.prisma.academicProgram.count({ where }),
                this.prisma.academicProgram.findMany({
                    where,
                    skip,
                    take: perPage,
                    orderBy: { name: 'asc' }
                })
            ]);
            return {
                total,
                data: items.map(item => AcademicProgramMapper.toGetSimpleAcademicProgram(item))
            };
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async delete(id) {
        try {
            await this.prisma.academicProgram.delete({
                where: { id }
            });
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
//# sourceMappingURL=prisma-academicProgram.repository.js.map