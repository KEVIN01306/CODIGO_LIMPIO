import type { AcademicProgramsRepository } from "../../program/domain/academicProgram.repository.js";
import type { CreateAuditLogUseCase } from "../../../Audit/application/create-audit-log.usecase.js";
export declare class DeleteAcademicProgramUseCase {
    private readonly academicProgramsRepository;
    private readonly createAuditLogUseCase;
    constructor(academicProgramsRepository: AcademicProgramsRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, tenantId: string): Promise<void>;
}
//# sourceMappingURL=delete-academicProgram.usecase.d.ts.map