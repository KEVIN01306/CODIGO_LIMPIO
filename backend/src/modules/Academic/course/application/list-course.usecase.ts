import type { CoursesRepository, CourseFilters } from "../../course/domain/course.repository.js";
import type { GetSimpleCourse } from "../../course/domain/course.entity.js";
import AppError from "@shared/errors/AppError.js";

export class ListCoursesUseCase {
    constructor(private readonly coursesRepository: CoursesRepository) { }

    async execute(page: number, perPage: number, filters: CourseFilters): Promise<{ total: number, data: GetSimpleCourse[] }> {
        try {
            return await this.coursesRepository.findAll(page, perPage, filters);
        } catch (error) {
            throw new AppError("Error fetching courses", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
