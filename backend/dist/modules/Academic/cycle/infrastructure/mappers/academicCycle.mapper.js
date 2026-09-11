import { CampusMapper } from "../../../../Academic/campus/infrastructure/mappers/campus.mapper.js";
export class AcademicCycleMapper {
    static toDomain(prismaAcademicCycle) {
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
    static toGetAcademicCycle(prismaAcademicCycle) {
        const cycle = this.toDomain(prismaAcademicCycle);
        return {
            ...cycle,
            campus: prismaAcademicCycle.campus ? CampusMapper.toGetSimpleCampus(prismaAcademicCycle.campus) : undefined
        };
    }
    static toGetSimpleAcademicCycle(prismaAcademicCycle) {
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
//# sourceMappingURL=academicCycle.mapper.js.map