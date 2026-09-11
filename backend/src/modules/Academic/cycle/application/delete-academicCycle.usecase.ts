import type { AcademicCyclesRepository } from "../../cycle/domain/academicCycle.repository.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

export class DeleteAcademicCycleUseCase {
    constructor(
        private readonly academicCyclesRepository: AcademicCyclesRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string, tenantId: string): Promise<void> {
        try {
            const cycle = await this.academicCyclesRepository.findById(id);
            if (!cycle || !cycle.campus || cycle.campus.tenantId !== tenantId) {
                throw new AppError("Academic cycle not found", "NOT_FOUND", 404);
            }

            await this.academicCyclesRepository.delete(id);

            await this.createAuditLogUseCase.execute({
                action: 'DELETE',
                resource: 'ACADEMIC_CYCLE',
                resourceId: id,
                details: { deleted: true }
            }).catch((err: any) => console.error("Failed to create audit log for academic cycle deletion", err));

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error deleting academic cycle", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
