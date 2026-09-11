import type { StudentRepository } from "../domain/student.repository.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
export declare class DeleteStudentUseCase {
    private readonly repository;
    private readonly createAuditLogUseCase;
    constructor(repository: StudentRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=delete-student.usecase.d.ts.map