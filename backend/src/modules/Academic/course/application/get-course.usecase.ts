import type { CoursesRepository } from "../../course/domain/course.repository.js";
import type { GetCourse } from "../../course/domain/course.entity.js";
import AppError from "@shared/errors/AppError.js";

export class GetCourseUseCase {
    constructor(private readonly coursesRepository: CoursesRepository) { }

    async execute(id: string, tenantId: string): Promise<GetCourse> {
        try {
            const course = await this.coursesRepository.findById(id);
            if (!course || course.tenantId !== tenantId) {
                throw new AppError("Course not found", "NOT_FOUND", 404);
            }
            return course;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching course", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
