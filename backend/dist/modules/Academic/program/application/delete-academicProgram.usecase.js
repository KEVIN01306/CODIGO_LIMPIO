import AppError from "../../../../shared/errors/AppError.js";
export class DeleteAcademicProgramUseCase {
    academicProgramsRepository;
    createAuditLogUseCase;
    constructor(academicProgramsRepository, createAuditLogUseCase) {
        this.academicProgramsRepository = academicProgramsRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id, tenantId) {
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
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error deleting academic program", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=delete-academicProgram.usecase.js.map