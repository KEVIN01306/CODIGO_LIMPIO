export class CreateCourseEnrollmentUseCase {
    repository;
    createAuditLogUseCase;
    constructor(repository, createAuditLogUseCase) {
        this.repository = repository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(data) {
        const entity = await this.repository.create(data);
        return entity;
    }
}
//# sourceMappingURL=create-courseEnrollment.usecase.js.map