import type { Cohort as PrismaCohort, Campus as PrismaCampus, AcademicProgram as PrismaAcademicProgram } from "@prisma/client";
import type { Cohort, GetCohort, GetSimpleCohort } from "../../domain/cohort.entity.js";
type PrismaCohortWithRelations = PrismaCohort & {
    campus?: PrismaCampus;
    program?: PrismaAcademicProgram;
};
export declare class CohortMapper {
    static toDomain(prismaCohort: PrismaCohort): Cohort;
    static toGetCohort(prismaCohort: PrismaCohortWithRelations): GetCohort;
    static toGetSimpleCohort(prismaCohort: PrismaCohortWithRelations): GetSimpleCohort;
}
export {};
//# sourceMappingURL=cohort.mapper.d.ts.map