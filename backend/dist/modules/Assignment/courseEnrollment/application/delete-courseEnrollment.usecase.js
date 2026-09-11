export class DeleteCourseEnrollmentUseCase {
    repository;
    createAuditLogUseCase;
    constructor(repository, createAuditLogUseCase) {
        this.repository = repository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id) {
        await this.repository.delete(id);
    }
}
//# sourceMappingURL=delete-courseEnrollment.usecase.js.map