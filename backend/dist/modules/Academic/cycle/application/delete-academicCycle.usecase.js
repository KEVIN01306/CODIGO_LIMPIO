import AppError from "../../../../shared/errors/AppError.js";
export class DeleteAcademicCycleUseCase {
    academicCyclesRepository;
    createAuditLogUseCase;
    constructor(academicCyclesRepository, createAuditLogUseCase) {
        this.academicCyclesRepository = academicCyclesRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id, tenantId) {
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
            }).catch((err) => console.error("Failed to create audit log for academic cycle deletion", err));
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error deleting academic cycle", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=delete-academicCycle.usecase.js.map