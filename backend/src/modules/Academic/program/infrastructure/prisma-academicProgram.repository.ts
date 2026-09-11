import type { PrismaClient, Prisma } from "@prisma/client";
import type { AcademicProgramsRepository, AcademicProgramFilters } from "../../program/domain/academicProgram.repository.js";
import type { AcademicProgram, CreateAcademicProgram, UpdateAcademicProgram, GetAcademicProgram, GetSimpleAcademicProgram } from "../../program/domain/academicProgram.entity.js";
import { PrismaErrorMapper } from "@shared/db/database/prisma/PrismaErrorMapper.js";
import { AcademicProgramMapper } from "./mappers/academicProgram.mapper.js";

export class PrismaAcademicProgramsRepository implements AcademicProgramsRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: CreateAcademicProgram): Promise<GetAcademicProgram> {
        try {
            const program = await this.prisma.academicProgram.create({
                data: {
                    tenantId: data.tenantId,
                    code: data.code,
                    name: data.name
                }
            });
            return AcademicProgramMapper.toGetAcademicProgram(program);
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async update(id: string, data: UpdateAcademicProgram): Promise<GetAcademicProgram> {
        try {
            const program = await this.prisma.academicProgram.update({
                where: { id },
                data: {
                    code: data.code,
                    name: data.name
                }
            });
            return AcademicProgramMapper.toGetAcademicProgram(program);
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findById(id: string): Promise<GetAcademicProgram | null> {
        try {
            const program = await this.prisma.academicProgram.findUnique({
                where: { id }
            });
            return program ? AcademicProgramMapper.toGetAcademicProgram(program) : null;
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findByCode(tenantId: string, code: string): Promise<AcademicProgram | null> {
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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findAll(page: number, perPage: number, filters: AcademicProgramFilters): Promise<{ total: number, data: GetSimpleAcademicProgram[] }> {
        try {
            const skip = (page - 1) * perPage;

            const where: Prisma.AcademicProgramWhereInput = {
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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.academicProgram.delete({
                where: { id }
            });
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
