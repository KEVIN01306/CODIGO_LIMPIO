import AppError from "@shared/errors/AppError.js";
export class GetCampusUseCase {
    campusesRepository;
    constructor(campusesRepository) {
        this.campusesRepository = campusesRepository;
    }
    async execute(id, tenantId) {
        try {
            const campus = await this.campusesRepository.findById(id);
            if (!campus || campus.tenantId !== tenantId) {
                throw new AppError("Campus not found", "NOT_FOUND", 404);
            }
            return campus;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching campus", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=get-campus.usecase.js.map