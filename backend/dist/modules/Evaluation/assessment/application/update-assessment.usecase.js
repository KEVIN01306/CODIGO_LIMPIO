import AppError from "../../../../shared/errors/AppError.js";
export class UpdateAssessmentUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id, data) {
        const entity = await this.repository.update(id, data);
        if (!entity)
            throw new AppError('Assessment not found', 'NOT_FOUND', 404);
        return entity;
    }
}
//# sourceMappingURL=update-assessment.usecase.js.map