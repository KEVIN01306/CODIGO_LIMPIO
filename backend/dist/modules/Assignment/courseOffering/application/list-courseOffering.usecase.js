export class ListCourseOfferingsUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(page, limit, filters) {
        return await this.repository.findAll(page, limit, filters);
    }
}
//# sourceMappingURL=list-courseOffering.usecase.js.map