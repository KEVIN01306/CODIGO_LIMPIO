import type { CreateCohort, UpdateCohort, GetCohort, GetSimpleCohort } from "./cohort.entity.js";
export interface CohortFilters {
    q?: string;
    campusId?: string;
    programId?: string;
    tenantId?: string;
}
export interface CohortsRepository {
    create(data: CreateCohort): Promise<GetCohort>;
    update(id: string, data: UpdateCohort): Promise<GetCohort>;
    findById(id: string): Promise<GetCohort | null>;
    findAll(page: number, perPage: number, filters: CohortFilters): Promise<{
        total: number;
        data: GetSimpleCohort[];
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=cohort.repository.d.ts.map