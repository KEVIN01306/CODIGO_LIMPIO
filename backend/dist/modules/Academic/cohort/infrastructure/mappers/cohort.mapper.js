import { CampusMapper } from "../../../../Academic/campus/infrastructure/mappers/campus.mapper.js";
import { AcademicProgramMapper } from "../../../../Academic/program/infrastructure/mappers/academicProgram.mapper.js";
export class CohortMapper {
    static toDomain(prismaCohort) {
        return {
            id: prismaCohort.id,
            campusId: prismaCohort.campusId,
            programId: prismaCohort.programId,
            name: prismaCohort.name,
            startYear: prismaCohort.startYear,
            createdAt: prismaCohort.createdAt,
            updatedAt: prismaCohort.updatedAt
        };
    }
    static toGetCohort(prismaCohort) {
        const cohort = this.toDomain(prismaCohort);
        return {
            ...cohort,
            campus: prismaCohort.campus ? CampusMapper.toGetSimpleCampus(prismaCohort.campus) : undefined,
            program: prismaCohort.program ? AcademicProgramMapper.toGetSimpleAcademicProgram(prismaCohort.program) : undefined
        };
    }
    static toGetSimpleCohort(prismaCohort) {
        return {
            id: prismaCohort.id,
            name: prismaCohort.name,
            startYear: prismaCohort.startYear,
            campusId: prismaCohort.campusId,
            programId: prismaCohort.programId,
            createdAt: prismaCohort.createdAt,
            campus: prismaCohort.campus ? CampusMapper.toGetSimpleCampus(prismaCohort.campus) : undefined,
            program: prismaCohort.program ? AcademicProgramMapper.toGetSimpleAcademicProgram(prismaCohort.program) : undefined
        };
    }
}
//# sourceMappingURL=cohort.mapper.js.map