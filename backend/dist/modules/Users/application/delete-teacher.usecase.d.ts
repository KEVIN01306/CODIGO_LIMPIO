import type { TeacherRepository } from "../domain/teacher.repository.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
export declare class DeleteTeacherUseCase {
    private readonly repository;
    private readonly createAuditLogUseCase;
    constructor(repository: TeacherRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=delete-teacher.usecase.d.ts.map