import AppError from "../../../shared/errors/AppError.js";
import { UniqueConstraintError } from "../../../shared/db/database/errors/UniqueConstraintError.js";
export class CreateAcademicProgramUseCase {
    academicProgramsRepository;
    createAuditLogUseCase;
    constructor(academicProgramsRepository, createAuditLogUseCase) {
        this.academicProgramsRepository = academicProgramsRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(data) {
        try {
            const existing = await this.academicProgramsRepository.findByCode(data.tenantId, data.code);
            if (existing) {
                throw new AppError("Academic program code already exists", "CODE_ALREADY_EXISTS", 400);
            }
            const program = await this.academicProgramsRepository.create(data);
            await this.createAuditLogUseCase.execute({
                action: 'CREATE',
                resource: 'ACADEMIC_PROGRAM',
                resourceId: program.id,
                details: { code: program.code, name: program.name }
            }).catch(err => console.error("Failed to create audit log for academic program creation", err));
            return program;
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new AppError("Academic program code already exists", "CODE_ALREADY_EXISTS", 400);
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error creating academic program", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=create-academicProgram.usecase.js.map