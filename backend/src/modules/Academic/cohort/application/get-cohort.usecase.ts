import type { CohortsRepository } from "../../cohort/domain/cohort.repository.js";
import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { GetCohort } from "../../cohort/domain/cohort.entity.js";
import AppError from "@shared/errors/AppError.js";

export class GetCohortUseCase {
    constructor(
        private readonly cohortsRepository: CohortsRepository,
        private readonly campusesRepository: CampusesRepository
    ) { }

    async execute(id: string, tenantId: string): Promise<GetCohort> {
        try {
            const cohort = await this.cohortsRepository.findById(id);
            if (!cohort) {
                throw new AppError("Cohort not found", "NOT_FOUND", 404);
            }

            const campus = await this.campusesRepository.findById(cohort.campusId);
            if (!campus || campus.tenantId !== tenantId) {
                throw new AppError("Cohort not found", "NOT_FOUND", 404);
            }

            return cohort;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching cohort", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
