import AppError from "../../../shared/errors/AppError.js";
export class DeleteTeacherUseCase {
    repository;
    createAuditLogUseCase;
    constructor(repository, createAuditLogUseCase) {
        this.repository = repository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id) {
        const existing = await this.repository.findById(id);
        if (!existing)
            throw new AppError("Teacher not found", "NOT_FOUND", 404);
        await this.repository.delete(id);
        await this.createAuditLogUseCase.execute({
            action: 'DELETE',
            resource: 'TEACHER',
            resourceId: id,
            details: {}
        }).catch(err => console.error("Failed to create audit log", err));
    }
}
//# sourceMappingURL=delete-teacher.usecase.js.map