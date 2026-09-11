import AppError from "../../../../shared/errors/AppError.js";
export class GetAssessmentUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const entity = await this.repository.findById(id);
        if (!entity)
            throw new AppError('Assessment not found', 'NOT_FOUND', 404);
        return entity;
    }
}
//# sourceMappingURL=get-assessment.usecase.js.map