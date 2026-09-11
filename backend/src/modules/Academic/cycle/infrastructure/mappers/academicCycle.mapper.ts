import type { AcademicCycle as PrismaAcademicCycle, Campus as PrismaCampus } from "@prisma/client";
import type { AcademicCycle, GetAcademicCycle, GetSimpleAcademicCycle } from "../../domain/academicCycle.entity.js";
import { CampusMapper } from "@modules/Academic/campus/infrastructure/mappers/campus.mapper.js";

type PrismaAcademicCycleWithRelations = PrismaAcademicCycle & {
    campus?: PrismaCampus;
};

export class AcademicCycleMapper {
    static toDomain(prismaAcademicCycle: PrismaAcademicCycle): AcademicCycle {
        return {
            id: prismaAcademicCycle.id,
            campusId: prismaAcademicCycle.campusId,
            name: prismaAcademicCycle.name,
            year: prismaAcademicCycle.year,
            order: prismaAcademicCycle.order,
            startDate: prismaAcademicCycle.startDate,
            endDate: prismaAcademicCycle.endDate,
            isCurrent: prismaAcademicCycle.isCurrent,
            createdAt: prismaAcademicCycle.createdAt,
            updatedAt: prismaAcademicCycle.updatedAt
        };
    }

    static toGetAcademicCycle(prismaAcademicCycle: PrismaAcademicCycleWithRelations): GetAcademicCycle {
        const cycle = this.toDomain(prismaAcademicCycle);
        return {
            ...cycle,
            campus: prismaAcademicCycle.campus ? CampusMapper.toGetSimpleCampus(prismaAcademicCycle.campus) : undefined
        };
    }

    static toGetSimpleAcademicCycle(prismaAcademicCycle: PrismaAcademicCycleWithRelations): GetSimpleAcademicCycle {
        return {
            id: prismaAcademicCycle.id,
            campusId: prismaAcademicCycle.campusId,
            name: prismaAcademicCycle.name,
            year: prismaAcademicCycle.year,
            order: prismaAcademicCycle.order,
            startDate: prismaAcademicCycle.startDate,
            endDate: prismaAcademicCycle.endDate,
            isCurrent: prismaAcademicCycle.isCurrent,
            createdAt: prismaAcademicCycle.createdAt,
            campus: prismaAcademicCycle.campus ? CampusMapper.toGetSimpleCampus(prismaAcademicCycle.campus) : undefined
        };
    }
}
