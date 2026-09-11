import type { StudentRepository } from "../domain/student.repository.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
export declare class UpdateStudentUseCase {
    private readonly repository;
    private readonly createAuditLogUseCase;
    constructor(repository: StudentRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, data: any): Promise<any>;
}
//# sourceMappingURL=update-student.usecase.d.ts.map