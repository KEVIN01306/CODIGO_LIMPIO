
import type { TeacherRepository } from "../domain/teacher.repository.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";

export class UpdateTeacherUseCase {
    constructor(
        private readonly repository: TeacherRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) {}

    async execute(id: string, data: any) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new AppError("Teacher not found", "NOT_FOUND", 404);
        
        const updated = await this.repository.update(id, data);
        
        await this.createAuditLogUseCase.execute({
            action: 'UPDATE',
            resource: 'TEACHER',
            resourceId: id,
            details: data
        }).catch(err => console.error("Failed to create audit log", err));

        return updated;
    }
}
