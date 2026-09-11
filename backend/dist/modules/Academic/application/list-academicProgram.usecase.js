import AppError from "../../../shared/errors/AppError.js";
export class ListAcademicProgramsUseCase {
    academicProgramsRepository;
    constructor(academicProgramsRepository) {
        this.academicProgramsRepository = academicProgramsRepository;
    }
    async execute(page, perPage, filters) {
        try {
            return await this.academicProgramsRepository.findAll(page, perPage, filters);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching academic programs", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=list-academicProgram.usecase.js.map