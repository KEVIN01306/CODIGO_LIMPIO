import AppError from "@shared/errors/AppError.js";
export class GetCohortUseCase {
    cohortsRepository;
    campusesRepository;
    constructor(cohortsRepository, campusesRepository) {
        this.cohortsRepository = cohortsRepository;
        this.campusesRepository = campusesRepository;
    }
    async execute(id, tenantId) {
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
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching cohort", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=get-cohort.usecase.js.map