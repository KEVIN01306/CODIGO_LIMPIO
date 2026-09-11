import AppError from "../../../shared/errors/AppError.js";
export class UpdateStudentUseCase {
    repository;
    createAuditLogUseCase;
    constructor(repository, createAuditLogUseCase) {
        this.repository = repository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id, data) {
        const existing = await this.repository.findById(id);
        if (!existing)
            throw new AppError("Student not found", "NOT_FOUND", 404);
        const updated = await this.repository.update(id, data);
        await this.createAuditLogUseCase.execute({
            action: 'UPDATE',
            resource: 'STUDENT',
            resourceId: id,
            details: data
        }).catch(err => console.error("Failed to create audit log", err));
        return updated;
    }
}
//# sourceMappingURL=update-student.usecase.js.map