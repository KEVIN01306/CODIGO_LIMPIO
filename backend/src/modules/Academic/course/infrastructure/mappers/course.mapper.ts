import type { Course as PrismaCourse, AcademicProgram as PrismaAcademicProgram } from "@prisma/client";
import type { Course, GetCourse, GetSimpleCourse } from "../../domain/course.entity.js";
import { AcademicProgramMapper } from "@modules/Academic/program/infrastructure/mappers/academicProgram.mapper.js";

type PrismaCourseWithRelations = PrismaCourse & {
    program: PrismaAcademicProgram | null;
};

export class CourseMapper {
    static toDomain(prismaCourse: PrismaCourse): Course {
        return {
            id: prismaCourse.id,
            tenantId: prismaCourse.tenantId,
            programId: prismaCourse.programId,
            code: prismaCourse.code,
            name: prismaCourse.name,
            description: prismaCourse.description,
            credits: prismaCourse.credits,
            isActive: prismaCourse.isActive,
            createdAt: prismaCourse.createdAt,
            updatedAt: prismaCourse.updatedAt
        };
    }

    static toGetCourse(prismaCourse: PrismaCourseWithRelations): GetCourse {
        const course = this.toDomain(prismaCourse);
        return {
            ...course,
            program: prismaCourse.program ? AcademicProgramMapper.toGetSimpleAcademicProgram(prismaCourse.program) : undefined
        };
    }

    static toGetSimpleCourse(prismaCourse: PrismaCourseWithRelations): GetSimpleCourse {
        return {
            id: prismaCourse.id,
            code: prismaCourse.code,
            name: prismaCourse.name,
            credits: prismaCourse.credits,
            programId: prismaCourse.programId,
            isActive: prismaCourse.isActive,
            createdAt: prismaCourse.createdAt,
            program: prismaCourse.program ? AcademicProgramMapper.toGetSimpleAcademicProgram(prismaCourse.program) : undefined
        };
    }
}
