import type { Course, CreateCourse, UpdateCourse, GetCourse, GetSimpleCourse } from "./course.entity.js";

export interface CourseFilters {
    q?: string;
    programId?: string;
    tenantId?: string;
    isActive?: boolean;
}

export interface CoursesRepository {
    create(data: CreateCourse): Promise<GetCourse>;
    update(id: string, data: UpdateCourse): Promise<GetCourse>;
    findById(id: string): Promise<GetCourse | null>;
    findByCode(tenantId: string, code: string): Promise<Course | null>;
    findAll(page: number, perPage: number, filters: CourseFilters): Promise<{ total: number, data: GetSimpleCourse[] }>;
    delete(id: string): Promise<void>;
}
