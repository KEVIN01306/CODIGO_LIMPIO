import type { CohortsRepository } from "../../cohort/domain/cohort.repository.js";
import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { GetCohort } from "../../cohort/domain/cohort.entity.js";
export declare class GetCohortUseCase {
    private readonly cohortsRepository;
    private readonly campusesRepository;
    constructor(cohortsRepository: CohortsRepository, campusesRepository: CampusesRepository);
    execute(id: string, tenantId: string): Promise<GetCohort>;
}
//# sourceMappingURL=get-cohort.usecase.d.ts.map