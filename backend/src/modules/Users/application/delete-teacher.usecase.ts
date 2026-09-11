
import type { TeacherRepository } from "../domain/teacher.repository.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";

export class DeleteTeacherUseCase {
    constructor(
        private readonly repository: TeacherRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) {}

    async execute(id: string) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new AppError("Teacher not found", "NOT_FOUND", 404);
        
        await this.repository.delete(id);
        
        await this.createAuditLogUseCase.execute({
            action: 'DELETE',
            resource: 'TEACHER',
            resourceId: id,
            details: {}
        }).catch(err => console.error("Failed to create audit log", err));
    }
}
