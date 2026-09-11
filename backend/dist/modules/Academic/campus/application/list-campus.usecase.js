import AppError from "../../../../shared/errors/AppError.js";
export class ListCampusesUseCase {
    campusesRepository;
    constructor(campusesRepository) {
        this.campusesRepository = campusesRepository;
    }
    async execute(page, perPage, filters) {
        try {
            return await this.campusesRepository.findAll(page, perPage, filters);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching campuses", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=list-campus.usecase.js.map