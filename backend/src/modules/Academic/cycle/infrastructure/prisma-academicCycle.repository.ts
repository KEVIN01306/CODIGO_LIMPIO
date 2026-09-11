import type { PrismaClient, Prisma } from "@prisma/client";
import type { AcademicCyclesRepository, AcademicCycleFilters } from "../../cycle/domain/academicCycle.repository.js";
import type { AcademicCycle, CreateAcademicCycle, UpdateAcademicCycle, GetAcademicCycle, GetSimpleAcademicCycle } from "../../cycle/domain/academicCycle.entity.js";
import { PrismaErrorMapper } from "@shared/db/database/prisma/PrismaErrorMapper.js";
import { AcademicCycleMapper } from "./mappers/academicCycle.mapper.js";

export class PrismaAcademicCyclesRepository implements AcademicCyclesRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(data: CreateAcademicCycle): Promise<GetAcademicCycle> {
        try {
            const cycle = await this.prisma.academicCycle.create({
                data: {
                    campusId: data.campusId,
                    name: data.name,
                    year: data.year,
                    order: data.order,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    isCurrent: data.isCurrent ?? false
                },
                include: {
                    campus: true
                }
            });
            return AcademicCycleMapper.toGetAcademicCycle(cycle);
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async update(id: string, data: UpdateAcademicCycle): Promise<GetAcademicCycle> {
        try {
            const cycle = await this.prisma.academicCycle.update({
                where: { id },
                data: {
                    campusId: data.campusId,
                    name: data.name,
                    year: data.year,
                    order: data.order,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    isCurrent: data.isCurrent
                },
                include: {
                    campus: true
                }
            });
            return AcademicCycleMapper.toGetAcademicCycle(cycle);
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findById(id: string): Promise<GetAcademicCycle | null> {
        try {
            const cycle = await this.prisma.academicCycle.findUnique({
                where: { id },
                include: {
                    campus: true
                }
            });
            return cycle ? AcademicCycleMapper.toGetAcademicCycle(cycle) : null;
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findAll(page: number, perPage: number, filters: AcademicCycleFilters): Promise<{ total: number, data: GetSimpleAcademicCycle[] }> {
        try {
            const skip = (page - 1) * perPage;
            
            const where: Prisma.AcademicCycleWhereInput = {};

            if (filters.tenantId) {
                where.campus = {
                    tenantId: filters.tenantId
                };
            }

            if (filters.campusId) {
                where.campusId = filters.campusId;
            }

            if (filters.q) {
                where.name = { contains: filters.q };
            }

            const [total, items] = await Promise.all([
                this.prisma.academicCycle.count({ where }),
                this.prisma.academicCycle.findMany({
                    where,
                    skip,
                    take: perPage,
                    include: {
                        campus: true
                    },
                    orderBy: { startDate: 'desc' }
                })
            ]);

            return {
                total,
                data: items.map(item => AcademicCycleMapper.toGetSimpleAcademicCycle(item))
            };
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.academicCycle.delete({
                where: { id }
            });
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
