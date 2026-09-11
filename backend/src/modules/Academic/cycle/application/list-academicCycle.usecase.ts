import type { AcademicCyclesRepository, AcademicCycleFilters } from "../../cycle/domain/academicCycle.repository.js";
import type { GetSimpleAcademicCycle } from "../../cycle/domain/academicCycle.entity.js";
import AppError from "@shared/errors/AppError.js";

export class ListAcademicCyclesUseCase {
    constructor(private readonly academicCyclesRepository: AcademicCyclesRepository) { }

    async execute(page: number, perPage: number, filters: AcademicCycleFilters): Promise<{ total: number, data: GetSimpleAcademicCycle[] }> {
        try {
            return await this.academicCyclesRepository.findAll(page, perPage, filters);
        } catch (error) {
            throw new AppError("Error fetching academic cycles", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
