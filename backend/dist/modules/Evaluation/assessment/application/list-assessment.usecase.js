export class ListAssessmentsUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(page, limit, filters) {
        return await this.repository.findAll(page, limit, filters);
    }
}
//# sourceMappingURL=list-assessment.usecase.js.map