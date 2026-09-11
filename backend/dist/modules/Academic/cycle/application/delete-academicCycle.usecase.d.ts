import type { AcademicCyclesRepository } from "../../cycle/domain/academicCycle.repository.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";
export declare class DeleteAcademicCycleUseCase {
    private readonly academicCyclesRepository;
    private readonly createAuditLogUseCase;
    constructor(academicCyclesRepository: AcademicCyclesRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, tenantId: string): Promise<void>;
}
//# sourceMappingURL=delete-academicCycle.usecase.d.ts.map