import type { PrismaClient } from "@prisma/client";
import type { CohortsRepository, CohortFilters } from "../../cohort/domain/cohort.repository.js";
import type { CreateCohort, UpdateCohort, GetCohort, GetSimpleCohort } from "../../cohort/domain/cohort.entity.js";
export declare class PrismaCohortsRepository implements CohortsRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(data: CreateCohort): Promise<GetCohort>;
    update(id: string, data: UpdateCohort): Promise<GetCohort>;
    findById(id: string): Promise<GetCohort | null>;
    findAll(page: number, perPage: number, filters: CohortFilters): Promise<{
        total: number;
        data: GetSimpleCohort[];
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=prisma-cohort.repository.d.ts.map