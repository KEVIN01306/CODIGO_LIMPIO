export class CreateAssessmentUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(data) {
        return await this.repository.create(data);
    }
}
//# sourceMappingURL=create-assessment.usecase.js.map