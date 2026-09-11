import { PrismaErrorMapper } from "@shared/db/database/prisma/PrismaErrorMapper.js";
import { CohortMapper } from "./mappers/cohort.mapper.js";
export class PrismaCohortsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            const cohort = await this.prisma.cohort.create({
                data: {
                    campusId: data.campusId,
                    programId: data.programId,
                    name: data.name,
                    startYear: data.startYear,
                },
                include: {
                    campus: true,
                    program: true
                }
            });
            return CohortMapper.toGetCohort(cohort);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async update(id, data) {
        try {
            const cohort = await this.prisma.cohort.update({
                where: { id },
                data: {
                    campusId: data.campusId,
                    programId: data.programId,
                    name: data.name,
                    startYear: data.startYear,
                },
                include: {
                    campus: true,
                    program: true
                }
            });
            return CohortMapper.toGetCohort(cohort);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findById(id) {
        try {
            const cohort = await this.prisma.cohort.findUnique({
                where: { id },
                include: {
                    campus: true,
                    program: true
                }
            });
            return cohort ? CohortMapper.toGetCohort(cohort) : null;
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findAll(page, perPage, filters) {
        try {
            const skip = (page - 1) * perPage;
            const where = {};
            if (filters.tenantId) {
                where.campus = {
                    tenantId: filters.tenantId
                };
            }
            if (filters.campusId) {
                where.campusId = filters.campusId;
            }
            if (filters.programId) {
                where.programId = filters.programId;
            }
            if (filters.q) {
                where.name = { contains: filters.q };
            }
            const [total, items] = await Promise.all([
                this.prisma.cohort.count({ where }),
                this.prisma.cohort.findMany({
                    where,
                    skip,
                    take: perPage,
                    include: {
                        campus: true,
                        program: true
                    },
                    orderBy: { name: 'asc' }
                })
            ]);
            return {
                total,
                data: items.map(item => CohortMapper.toGetSimpleCohort(item))
            };
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async delete(id) {
        try {
            await this.prisma.cohort.delete({
                where: { id }
            });
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
//# sourceMappingURL=prisma-cohort.repository.js.map