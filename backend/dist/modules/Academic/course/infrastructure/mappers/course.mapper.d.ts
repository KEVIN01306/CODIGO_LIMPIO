import type { Course as PrismaCourse, AcademicProgram as PrismaAcademicProgram } from "@prisma/client";
import type { Course, GetCourse, GetSimpleCourse } from "../../domain/course.entity.js";
type PrismaCourseWithRelations = PrismaCourse & {
    program: PrismaAcademicProgram | null;
};
export declare class CourseMapper {
    static toDomain(prismaCourse: PrismaCourse): Course;
    static toGetCourse(prismaCourse: PrismaCourseWithRelations): GetCourse;
    static toGetSimpleCourse(prismaCourse: PrismaCourseWithRelations): GetSimpleCourse;
}
export {};
//# sourceMappingURL=course.mapper.d.ts.map