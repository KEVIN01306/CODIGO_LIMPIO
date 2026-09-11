import type { PrismaClient } from "@prisma/client";
import type { CoursesRepository, CourseFilters } from "../../course/domain/course.repository.js";
import type { Course, CreateCourse, UpdateCourse, GetCourse, GetSimpleCourse } from "../../course/domain/course.entity.js";
export declare class PrismaCoursesRepository implements CoursesRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(data: CreateCourse): Promise<GetCourse>;
    update(id: string, data: UpdateCourse): Promise<GetCourse>;
    findById(id: string): Promise<GetCourse | null>;
    findByCode(tenantId: string, code: string): Promise<Course | null>;
    findAll(page: number, perPage: number, filters: CourseFilters): Promise<{
        total: number;
        data: GetSimpleCourse[];
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=prisma-course.repository.d.ts.map