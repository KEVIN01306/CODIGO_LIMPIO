import AppError from "@shared/errors/AppError.js";
export class DeleteCohortUseCase {
    cohortsRepository;
    campusesRepository;
    createAuditLogUseCase;
    constructor(cohortsRepository, campusesRepository, createAuditLogUseCase) {
        this.cohortsRepository = cohortsRepository;
        this.campusesRepository = campusesRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id, tenantId) {
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
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error deleting cohort", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=delete-cohort.usecase.js.map