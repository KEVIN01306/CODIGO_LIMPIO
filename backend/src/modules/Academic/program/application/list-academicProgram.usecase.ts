import type { AcademicProgramsRepository, AcademicProgramFilters } from "../../program/domain/academicProgram.repository.js";
import type { GetSimpleAcademicProgram } from "../../program/domain/academicProgram.entity.js";
import AppError from "@shared/errors/AppError.js";

export class ListAcademicProgramsUseCase {
    constructor(private readonly academicProgramsRepository: AcademicProgramsRepository) { }

    async execute(page: number, perPage: number, filters: AcademicProgramFilters): Promise<{ total: number, data: GetSimpleAcademicProgram[] }> {
        try {
            return await this.academicProgramsRepository.findAll(page, perPage, filters);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching academic programs", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
