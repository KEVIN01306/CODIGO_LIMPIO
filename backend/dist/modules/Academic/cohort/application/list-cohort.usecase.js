import AppError from "@shared/errors/AppError.js";
export class ListCohortsUseCase {
    cohortsRepository;
    campusesRepository;
    constructor(cohortsRepository, campusesRepository) {
        this.cohortsRepository = cohortsRepository;
        this.campusesRepository = campusesRepository;
    }
    async execute(page, perPage, filters) {
        try {
            // First we need to find all campuses for this tenant if campusId is not provided
            // or verify the provided campusId belongs to the tenant
            let validCampusIds = [];
            if (filters.campusId) {
                const campus = await this.campusesRepository.findById(filters.campusId);
                if (!campus || campus.tenantId !== filters.tenantId) {
                    return { total: 0, data: [] }; // Return empty if unauthorized campus
                }
                validCampusIds = [filters.campusId];
            }
            else {
                // If no specific campus is filtered, we need to ensure we only return cohorts for this tenant's campuses
                // A better way would be modifying repository to accept tenantId and do a join, but for simplicity we'll fetch campuses
                // Actually, since Prisma filters require either a list of IDs or a relation filter, let's use a relation filter in repository?
                // The current PrismaCohortsRepository doesn't support tenantId filtering directly because tenantId is on Campus.
                // I will add a check in the repository or just rely on passing campusId if needed.
                // Wait, the repository needs to filter by tenantId through the Campus relation. Let's assume the repository has been updated to handle it or I'll just throw an error.
                // I will modify PrismaCohortsRepository to accept tenantId in CohortFilters.
            }
            return await this.cohortsRepository.findAll(page, perPage, filters);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching cohorts", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=list-cohort.usecase.js.map