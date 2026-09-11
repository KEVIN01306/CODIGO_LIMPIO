import type { TeacherRepository } from "../domain/teacher.repository.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
export declare class UpdateTeacherUseCase {
    private readonly repository;
    private readonly createAuditLogUseCase;
    constructor(repository: TeacherRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, data: any): Promise<any>;
}
//# sourceMappingURL=update-teacher.usecase.d.ts.map