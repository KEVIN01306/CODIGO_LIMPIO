import AppError from "../../../../shared/errors/AppError.js";
export class ListCoursesUseCase {
    coursesRepository;
    constructor(coursesRepository) {
        this.coursesRepository = coursesRepository;
    }
    async execute(page, perPage, filters) {
        try {
            return await this.coursesRepository.findAll(page, perPage, filters);
        }
        catch (error) {
            throw new AppError("Error fetching courses", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=list-course.usecase.js.map