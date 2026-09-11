import { AcademicProgramMapper } from "../../../../Academic/program/infrastructure/mappers/academicProgram.mapper.js";
export class CourseMapper {
    static toDomain(prismaCourse) {
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
    static toGetCourse(prismaCourse) {
        const course = this.toDomain(prismaCourse);
        return {
            ...course,
            program: prismaCourse.program ? AcademicProgramMapper.toGetSimpleAcademicProgram(prismaCourse.program) : undefined
        };
    }
    static toGetSimpleCourse(prismaCourse) {
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
//# sourceMappingURL=course.mapper.js.map