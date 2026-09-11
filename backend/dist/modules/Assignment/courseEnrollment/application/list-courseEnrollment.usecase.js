export class ListCourseEnrollmentsUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(page, limit, filters) {
        return await this.repository.findAll(page, limit, filters);
    }
}
//# sourceMappingURL=list-courseEnrollment.usecase.js.map