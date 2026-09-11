export class UpdateCourseEnrollmentUseCase {
    repository;
    createAuditLogUseCase;
    constructor(repository, createAuditLogUseCase) {
        this.repository = repository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id, data) {
        const entity = await this.repository.update(id, data);
        return entity;
    }
}
//# sourceMappingURL=update-courseEnrollment.usecase.js.map