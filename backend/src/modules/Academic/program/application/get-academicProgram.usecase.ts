import type { AcademicProgramsRepository } from "../../program/domain/academicProgram.repository.js";
import type { GetAcademicProgram } from "../../program/domain/academicProgram.entity.js";
import AppError from "@shared/errors/AppError.js";

export class GetAcademicProgramUseCase {
    constructor(private readonly academicProgramsRepository: AcademicProgramsRepository) { }

    async execute(id: string, tenantId: string): Promise<GetAcademicProgram> {
        try {
            const program = await this.academicProgramsRepository.findById(id);
            if (!program || program.tenantId !== tenantId) {
                throw new AppError("Academic program not found", "NOT_FOUND", 404);
            }
            return program;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching academic program", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
