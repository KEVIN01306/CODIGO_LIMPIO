import AppError from "../../../../shared/errors/AppError.js";
import { UniqueConstraintError } from "../../../../shared/db/database/errors/UniqueConstraintError.js";
export class UpdateAcademicProgramUseCase {
    academicProgramsRepository;
    createAuditLogUseCase;
    constructor(academicProgramsRepository, createAuditLogUseCase) {
        this.academicProgramsRepository = academicProgramsRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id, data, tenantId) {
        try {
            const existing = await this.academicProgramsRepository.findById(id);
            if (!existing || existing.tenantId !== tenantId) {
                throw new AppError("Academic program not found", "NOT_FOUND", 404);
            }
            if (data.code && data.code !== existing.code) {
                const codeExists = await this.academicProgramsRepository.findByCode(tenantId, data.code);
                if (codeExists) {
                    throw new AppError("Academic program code already exists", "CODE_ALREADY_EXISTS", 400);
                }
            }
            const program = await this.academicProgramsRepository.update(id, data);
            await this.createAuditLogUseCase.execute({
                action: 'UPDATE',
                resource: 'ACADEMIC_PROGRAM',
                resourceId: program.id,
                details: { updatedFields: Object.keys(data) }
            }).catch(err => console.error("Failed to create audit log for academic program update", err));
            return program;
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new AppError("Academic program code already exists", "CODE_ALREADY_EXISTS", 400);
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error updating academic program", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=update-academicProgram.usecase.js.map