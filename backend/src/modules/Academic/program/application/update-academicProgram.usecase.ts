import type { AcademicProgramsRepository } from "@modules/Academic/program/domain/academicProgram.repository.js";
import type { GetAcademicProgram } from "@modules/Academic/program/domain/academicProgram.entity.js";
import AppError from "@shared/errors/AppError.js";
import { UniqueConstraintError } from "@shared/db/database/errors/UniqueConstraintError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

interface UpdateAcademicProgramRequest {
    code?: string;
    name?: string;
}

export class UpdateAcademicProgramUseCase {
    constructor(
        private readonly academicProgramsRepository: AcademicProgramsRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string, data: UpdateAcademicProgramRequest, tenantId: string): Promise<GetAcademicProgram> {
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
        } catch (error) {
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
