import AppError from "@shared/errors/AppError.js";
export class GetCourseUseCase {
    coursesRepository;
    constructor(coursesRepository) {
        this.coursesRepository = coursesRepository;
    }
    async execute(id, tenantId) {
        try {
            const course = await this.coursesRepository.findById(id);
            if (!course || course.tenantId !== tenantId) {
                throw new AppError("Course not found", "NOT_FOUND", 404);
            }
            return course;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching course", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=get-course.usecase.js.map