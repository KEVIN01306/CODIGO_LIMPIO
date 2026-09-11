import type { CohortsRepository } from "../../cohort/domain/cohort.repository.js";
import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

export class DeleteCohortUseCase {
    constructor(
        private readonly cohortsRepository: CohortsRepository,
        private readonly campusesRepository: CampusesRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string, tenantId: string): Promise<void> {
        try {
            const existing = await this.cohortsRepository.findById(id);
            if (!existing) {
                throw new AppError("Cohort not found", "NOT_FOUND", 404);
            }

            const campus = await this.campusesRepository.findById(existing.campusId);
            if (!campus || campus.tenantId !== tenantId) {
                throw new AppError("Cohort not found", "NOT_FOUND", 404);
            }

            await this.cohortsRepository.delete(id);

            await this.createAuditLogUseCase.execute({
                action: 'DELETE',
                resource: 'COHORT',
                resourceId: id,
                details: { deleted: true }
            }).catch(err => console.error("Failed to create audit log for cohort deletion", err));

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error deleting cohort", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
