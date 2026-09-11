
import type { StudentRepository } from "../domain/student.repository.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";

export class DeleteStudentUseCase {
    constructor(
        private readonly repository: StudentRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) {}

    async execute(id: string) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new AppError("Student not found", "NOT_FOUND", 404);
        
        await this.repository.delete(id);
        
        await this.createAuditLogUseCase.execute({
            action: 'DELETE',
            resource: 'STUDENT',
            resourceId: id,
            details: {}
        }).catch(err => console.error("Failed to create audit log", err));
    }
}
