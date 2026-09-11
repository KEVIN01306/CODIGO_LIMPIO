import AppError from "@shared/errors/AppError.js";
export class GetCourseEnrollmentUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const entity = await this.repository.findById(id);
        if (!entity)
            throw new AppError('CourseEnrollment not found', 'NOT_FOUND', 404);
        return entity;
    }
}
//# sourceMappingURL=get-courseEnrollment.usecase.js.map