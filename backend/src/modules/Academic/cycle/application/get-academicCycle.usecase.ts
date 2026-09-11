import type { AcademicCyclesRepository } from "../../cycle/domain/academicCycle.repository.js";
import type { GetAcademicCycle } from "../../cycle/domain/academicCycle.entity.js";
import AppError from "@shared/errors/AppError.js";

export class GetAcademicCycleUseCase {
    constructor(
        private readonly academicCyclesRepository: AcademicCyclesRepository
    ) { }

    async execute(id: string, tenantId: string): Promise<GetAcademicCycle> {
        try {
            const cycle = await this.academicCyclesRepository.findById(id);
            if (!cycle || !cycle.campus || cycle.campus.tenantId !== tenantId) {
                throw new AppError("Academic cycle not found", "NOT_FOUND", 404);
            }
            return cycle;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching academic cycle", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
