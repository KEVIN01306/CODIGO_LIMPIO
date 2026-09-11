import AppError from "../../../shared/errors/AppError.js";
export class DeleteCampusUseCase {
    campusesRepository;
    createAuditLogUseCase;
    constructor(campusesRepository, createAuditLogUseCase) {
        this.campusesRepository = campusesRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id, tenantId) {
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
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error deleting campus", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=delete-campus.usecase.js.map