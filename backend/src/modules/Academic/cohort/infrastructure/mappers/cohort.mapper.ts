import type { Cohort as PrismaCohort, Campus as PrismaCampus, AcademicProgram as PrismaAcademicProgram } from "@prisma/client";
import type { Cohort, GetCohort, GetSimpleCohort } from "../../domain/cohort.entity.js";
import { CampusMapper } from "@modules/Academic/campus/infrastructure/mappers/campus.mapper.js";
import { AcademicProgramMapper } from "@modules/Academic/program/infrastructure/mappers/academicProgram.mapper.js";

type PrismaCohortWithRelations = PrismaCohort & {
    campus?: PrismaCampus;
    program?: PrismaAcademicProgram;
};

export class CohortMapper {
    static toDomain(prismaCohort: PrismaCohort): Cohort {
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

    static toGetCohort(prismaCohort: PrismaCohortWithRelations): GetCohort {
        const cohort = this.toDomain(prismaCohort);
        return {
            ...cohort,
            campus: prismaCohort.campus ? CampusMapper.toGetSimpleCampus(prismaCohort.campus) : undefined,
            program: prismaCohort.program ? AcademicProgramMapper.toGetSimpleAcademicProgram(prismaCohort.program) : undefined
        };
    }

    static toGetSimpleCohort(prismaCohort: PrismaCohortWithRelations): GetSimpleCohort {
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
