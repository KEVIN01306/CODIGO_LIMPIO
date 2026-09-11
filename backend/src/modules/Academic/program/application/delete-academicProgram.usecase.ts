import type { AcademicProgramsRepository } from "../../program/domain/academicProgram.repository.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

export class DeleteAcademicProgramUseCase {
    constructor(
        private readonly academicProgramsRepository: AcademicProgramsRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string, tenantId: string): Promise<void> {
        try {
            const existing = await this.academicProgramsRepository.findById(id);
            if (!existing || existing.tenantId !== tenantId) {
                throw new AppError("Academic program not found", "NOT_FOUND", 404);
            }

            await this.academicProgramsRepository.delete(id);

            await this.createAuditLogUseCase.execute({
                action: 'DELETE',
                resource: 'ACADEMIC_PROGRAM',
                resourceId: id,
                details: { deleted: true }
            }).catch(err => console.error("Failed to create audit log for academic program deletion", err));

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error deleting academic program", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
