import type { PrismaClient, Prisma } from "@prisma/client";
import type { CohortsRepository, CohortFilters } from "../../cohort/domain/cohort.repository.js";
import type { Cohort, CreateCohort, UpdateCohort, GetCohort, GetSimpleCohort } from "../../cohort/domain/cohort.entity.js";
import { PrismaErrorMapper } from "@shared/db/database/prisma/PrismaErrorMapper.js";
import { CohortMapper } from "./mappers/cohort.mapper.js";

export class PrismaCohortsRepository implements CohortsRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: CreateCohort): Promise<GetCohort> {
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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async update(id: string, data: UpdateCohort): Promise<GetCohort> {
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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findById(id: string): Promise<GetCohort | null> {
        try {
            const cohort = await this.prisma.cohort.findUnique({
                where: { id },
                include: {
                    campus: true,
                    program: true
                }
            });
            return cohort ? CohortMapper.toGetCohort(cohort) : null;
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findAll(page: number, perPage: number, filters: CohortFilters): Promise<{ total: number, data: GetSimpleCohort[] }> {
        try {
            const skip = (page - 1) * perPage;

            const where: Prisma.CohortWhereInput = {};

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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.cohort.delete({
                where: { id }
            });
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
