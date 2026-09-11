import type { PrismaClient, Prisma } from "@prisma/client";
import type { CampusesRepository, CampusFilters } from "../../campus/domain/campus.repository.js";
import type { Campus, CreateCampus, UpdateCampus, GetCampus, GetSimpleCampus } from "../../campus/domain/campus.entity.js";
import { PrismaErrorMapper } from "@shared/db/database/prisma/PrismaErrorMapper.js";
import { CampusMapper } from "./mappers/campus.mapper.js";

export class PrismaCampusesRepository implements CampusesRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: CreateCampus): Promise<GetCampus> {
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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async update(id: string, data: UpdateCampus): Promise<GetCampus> {
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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findById(id: string): Promise<GetCampus | null> {
        try {
            const campus = await this.prisma.campus.findUnique({
                where: { id }
            });
            return campus ? CampusMapper.toGetCampus(campus) : null;
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findByCode(tenantId: string, code: string): Promise<Campus | null> {
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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findAll(page: number, perPage: number, filters: CampusFilters): Promise<{ total: number, data: GetSimpleCampus[] }> {
        try {
            const skip = (page - 1) * perPage;

            const where: Prisma.CampusWhereInput = {
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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.campus.delete({
                where: { id }
            });
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
