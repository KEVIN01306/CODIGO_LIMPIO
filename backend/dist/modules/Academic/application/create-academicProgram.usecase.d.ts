import type { AcademicProgramsRepository } from "../domain/academicProgram.repository.js";
import type { GetAcademicProgram } from "../domain/academicProgram.entity.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
interface CreateAcademicProgramRequest {
    tenantId: string;
    code: string;
    name: string;
}
export declare class CreateAcademicProgramUseCase {
    private readonly academicProgramsRepository;
    private readonly createAuditLogUseCase;
    constructor(academicProgramsRepository: AcademicProgramsRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(data: CreateAcademicProgramRequest): Promise<GetAcademicProgram>;
}
export {};
//# sourceMappingURL=create-academicProgram.usecase.d.ts.map