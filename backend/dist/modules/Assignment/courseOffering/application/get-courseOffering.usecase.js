import AppError from "../../../../shared/errors/AppError.js";
export class GetCourseOfferingUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const entity = await this.repository.findById(id);
        if (!entity)
            throw new AppError('CourseOffering not found', 'NOT_FOUND', 404);
        return entity;
    }
}
//# sourceMappingURL=get-courseOffering.usecase.js.map