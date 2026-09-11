import AppError from "@shared/errors/AppError.js";
export class GetAcademicCycleUseCase {
    academicCyclesRepository;
    constructor(academicCyclesRepository) {
        this.academicCyclesRepository = academicCyclesRepository;
    }
    async execute(id, tenantId) {
        try {
            const cycle = await this.academicCyclesRepository.findById(id);
            if (!cycle || !cycle.campus || cycle.campus.tenantId !== tenantId) {
                throw new AppError("Academic cycle not found", "NOT_FOUND", 404);
            }
            return cycle;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching academic cycle", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=get-academicCycle.usecase.js.map