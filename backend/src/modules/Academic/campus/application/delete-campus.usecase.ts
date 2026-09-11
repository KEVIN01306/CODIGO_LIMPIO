import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

export class DeleteCampusUseCase {
    constructor(
        private readonly campusesRepository: CampusesRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string, tenantId: string): Promise<void> {
        try {
            const existing = await this.campusesRepository.findById(id);
            if (!existing || existing.tenantId !== tenantId) {
                throw new AppError("Campus not found", "NOT_FOUND", 404);
            }

            await this.campusesRepository.delete(id);

            await this.createAuditLogUseCase.execute({
                action: 'DELETE',
                resource: 'CAMPUS',
                resourceId: id,
                details: { deleted: true }
            }).catch(err => console.error("Failed to create audit log for campus deletion", err));

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error deleting campus", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
