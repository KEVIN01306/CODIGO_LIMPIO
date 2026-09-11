import type { CohortsRepository } from "../domain/cohort.repository.js";
import type { CampusesRepository } from "../domain/campus.repository.js";
import type { AcademicProgramsRepository } from "../domain/academicProgram.repository.js";
import type { GetCohort } from "../domain/cohort.entity.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
interface UpdateCohortRequest {
    campusId?: string;
    programId?: string;
    name?: string;
    startYear?: number;
}
export declare class UpdateCohortUseCase {
    private readonly cohortsRepository;
    private readonly campusesRepository;
    private readonly academicProgramsRepository;
    private readonly createAuditLogUseCase;
    constructor(cohortsRepository: CohortsRepository, campusesRepository: CampusesRepository, academicProgramsRepository: AcademicProgramsRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, data: UpdateCohortRequest, tenantId: string): Promise<GetCohort>;
}
export {};
//# sourceMappingURL=update-cohort.usecase.d.ts.map