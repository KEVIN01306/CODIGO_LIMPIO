import type { AcademicProgramsRepository } from "../../../Academic/program/domain/academicProgram.repository.js";
import type { GetAcademicProgram } from "../../../Academic/program/domain/academicProgram.entity.js";
import type { CreateAuditLogUseCase } from "../../../Audit/application/create-audit-log.usecase.js";
interface UpdateAcademicProgramRequest {
    code?: string;
    name?: string;
}
export declare class UpdateAcademicProgramUseCase {
    private readonly academicProgramsRepository;
    private readonly createAuditLogUseCase;
    constructor(academicProgramsRepository: AcademicProgramsRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, data: UpdateAcademicProgramRequest, tenantId: string): Promise<GetAcademicProgram>;
}
export {};
//# sourceMappingURL=update-academicProgram.usecase.d.ts.map