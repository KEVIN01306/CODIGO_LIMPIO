import type { CohortsRepository, CohortFilters } from "../../cohort/domain/cohort.repository.js";
import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { GetSimpleCohort } from "../../cohort/domain/cohort.entity.js";
export declare class ListCohortsUseCase {
    private readonly cohortsRepository;
    private readonly campusesRepository;
    constructor(cohortsRepository: CohortsRepository, campusesRepository: CampusesRepository);
    execute(page: number, perPage: number, filters: CohortFilters & {
        tenantId: string;
    }): Promise<{
        total: number;
        data: GetSimpleCohort[];
    }>;
}
//# sourceMappingURL=list-cohort.usecase.d.ts.map