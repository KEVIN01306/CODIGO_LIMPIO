import AppError from "../../../../shared/errors/AppError.js";
export class ListAcademicCyclesUseCase {
    academicCyclesRepository;
    constructor(academicCyclesRepository) {
        this.academicCyclesRepository = academicCyclesRepository;
    }
    async execute(page, perPage, filters) {
        try {
            return await this.academicCyclesRepository.findAll(page, perPage, filters);
        }
        catch (error) {
            throw new AppError("Error fetching academic cycles", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=list-academicCycle.usecase.js.map