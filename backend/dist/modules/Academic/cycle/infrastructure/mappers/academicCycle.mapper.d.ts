import type { AcademicCycle as PrismaAcademicCycle, Campus as PrismaCampus } from "@prisma/client";
import type { AcademicCycle, GetAcademicCycle, GetSimpleAcademicCycle } from "../../domain/academicCycle.entity.js";
type PrismaAcademicCycleWithRelations = PrismaAcademicCycle & {
    campus?: PrismaCampus;
};
export declare class AcademicCycleMapper {
    static toDomain(prismaAcademicCycle: PrismaAcademicCycle): AcademicCycle;
    static toGetAcademicCycle(prismaAcademicCycle: PrismaAcademicCycleWithRelations): GetAcademicCycle;
    static toGetSimpleAcademicCycle(prismaAcademicCycle: PrismaAcademicCycleWithRelations): GetSimpleAcademicCycle;
}
export {};
//# sourceMappingURL=academicCycle.mapper.d.ts.map