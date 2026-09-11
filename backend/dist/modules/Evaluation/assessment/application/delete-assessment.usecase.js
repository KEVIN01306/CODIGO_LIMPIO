import AppError from "../../../../shared/errors/AppError.js";
export class DeleteAssessmentUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const entity = await this.repository.findById(id);
        if (!entity)
            throw new AppError('Assessment not found', 'NOT_FOUND', 404);
        await this.repository.delete(id);
    }
}
//# sourceMappingURL=delete-assessment.usecase.js.map