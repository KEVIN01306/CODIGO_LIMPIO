import type { AcademicProgramsRepository } from "@modules/Academic/program/domain/academicProgram.repository.js";
import type { GetAcademicProgram } from "@modules/Academic/program/domain/academicProgram.entity.js";
import AppError from "@shared/errors/AppError.js";
import { UniqueConstraintError } from "@shared/db/database/errors/UniqueConstraintError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

interface CreateAcademicProgramRequest {
    tenantId: string;
    code: string;
    name: string;
}

export class CreateAcademicProgramUseCase {
    constructor(
        private readonly academicProgramsRepository: AcademicProgramsRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(data: CreateAcademicProgramRequest): Promise<GetAcademicProgram> {
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
        } catch (error) {
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
