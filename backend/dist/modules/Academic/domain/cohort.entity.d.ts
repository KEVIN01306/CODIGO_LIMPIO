import type { GetSimpleCampus } from "./campus.entity.js";
import type { GetSimpleAcademicProgram } from "./academicProgram.entity.js";
export interface Cohort {
    id: string;
    campusId: string;
    programId: string;
    name: string;
    startYear: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateCohort extends Omit<Cohort, 'id' | 'createdAt' | 'updatedAt'> {
}
export interface UpdateCohort extends Partial<Omit<Cohort, 'id' | 'createdAt' | 'updatedAt'>> {
}
export interface GetCohort extends Cohort {
    campus?: GetSimpleCampus;
    program?: GetSimpleAcademicProgram;
}
export interface GetSimpleCohort extends Pick<Cohort, 'id' | 'name' | 'startYear' | 'campusId' | 'programId' | 'createdAt'> {
    campus?: GetSimpleCampus;
    program?: GetSimpleAcademicProgram;
}
//# sourceMappingURL=cohort.entity.d.ts.map