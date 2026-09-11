import type { CohortsRepository } from "../../cohort/domain/cohort.repository.js";
import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { CreateAuditLogUseCase } from "../../../Audit/application/create-audit-log.usecase.js";
export declare class DeleteCohortUseCase {
    private readonly cohortsRepository;
    private readonly campusesRepository;
    private readonly createAuditLogUseCase;
    constructor(cohortsRepository: CohortsRepository, campusesRepository: CampusesRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, tenantId: string): Promise<void>;
}
//# sourceMappingURL=delete-cohort.usecase.d.ts.map