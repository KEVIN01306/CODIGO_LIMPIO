import type { CohortsRepository } from "../../cohort/domain/cohort.repository.js";
import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { AcademicProgramsRepository } from "../../program/domain/academicProgram.repository.js";
import type { GetCohort } from "../../cohort/domain/cohort.entity.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";
interface CreateCohortRequest {
    tenantId: string;
    campusId: string;
    programId: string;
    name: string;
    startYear: number;
}
export declare class CreateCohortUseCase {
    private readonly cohortsRepository;
    private readonly campusesRepository;
    private readonly academicProgramsRepository;
    private readonly createAuditLogUseCase;
    constructor(cohortsRepository: CohortsRepository, campusesRepository: CampusesRepository, academicProgramsRepository: AcademicProgramsRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(data: CreateCohortRequest): Promise<GetCohort>;
}
export {};
//# sourceMappingURL=create-cohort.usecase.d.ts.map