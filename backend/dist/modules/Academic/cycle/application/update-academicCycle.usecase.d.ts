import type { AcademicCyclesRepository } from "../../cycle/domain/academicCycle.repository.js";
import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { GetAcademicCycle } from "../../cycle/domain/academicCycle.entity.js";
import type { CreateAuditLogUseCase } from "../../../Audit/application/create-audit-log.usecase.js";
interface UpdateAcademicCycleRequest {
    campusId?: string;
    name?: string;
    year?: number;
    order?: number;
    startDate?: Date;
    endDate?: Date;
    isCurrent?: boolean;
}
export declare class UpdateAcademicCycleUseCase {
    private readonly academicCyclesRepository;
    private readonly campusesRepository;
    private readonly createAuditLogUseCase;
    constructor(academicCyclesRepository: AcademicCyclesRepository, campusesRepository: CampusesRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, data: UpdateAcademicCycleRequest, tenantId: string): Promise<GetAcademicCycle>;
}
export {};
//# sourceMappingURL=update-academicCycle.usecase.d.ts.map