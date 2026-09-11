import AppError from "@shared/errors/AppError.js";
export class GetAcademicProgramUseCase {
    academicProgramsRepository;
    constructor(academicProgramsRepository) {
        this.academicProgramsRepository = academicProgramsRepository;
    }
    async execute(id, tenantId) {
        try {
            const program = await this.academicProgramsRepository.findById(id);
            if (!program || program.tenantId !== tenantId) {
                throw new AppError("Academic program not found", "NOT_FOUND", 404);
            }
            return program;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching academic program", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=get-academicProgram.usecase.js.map