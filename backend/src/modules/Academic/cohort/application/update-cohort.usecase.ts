import type { CohortsRepository } from "@modules/Academic/cohort/domain/cohort.repository.js";
import type { CampusesRepository } from "@modules/Academic/campus/domain/campus.repository.js";
import type { AcademicProgramsRepository } from "@modules/Academic/program/domain/academicProgram.repository.js";
import type { GetCohort } from "@modules/Academic/cohort/domain/cohort.entity.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

interface UpdateCohortRequest {
    campusId?: string;
    programId?: string;
    name?: string;
    startYear?: number;
}

export class UpdateCohortUseCase {
    constructor(
        private readonly cohortsRepository: CohortsRepository,
        private readonly campusesRepository: CampusesRepository,
        private readonly academicProgramsRepository: AcademicProgramsRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string, data: UpdateCohortRequest, tenantId: string): Promise<GetCohort> {
        try {
            const existing = await this.cohortsRepository.findById(id);
            if (!existing) {
                throw new AppError("Cohort not found", "NOT_FOUND", 404);
            }

            // We must verify the existing cohort belongs to the tenant
            // Since cohort itself doesn't have tenantId directly, we check through campus
            const existingCampus = await this.campusesRepository.findById(existing.campusId);
            if (!existingCampus || existingCampus.tenantId !== tenantId) {
                throw new AppError("Cohort not found", "NOT_FOUND", 404);
            }

            if (data.campusId && data.campusId !== existing.campusId) {
                const campus = await this.campusesRepository.findById(data.campusId);
                if (!campus || campus.tenantId !== tenantId) {
                    throw new AppError("Invalid campus", "INVALID_CAMPUS", 400);
                }
            }

            if (data.programId && data.programId !== existing.programId) {
                const program = await this.academicProgramsRepository.findById(data.programId);
                if (!program || program.tenantId !== tenantId) {
                    throw new AppError("Invalid academic program", "INVALID_PROGRAM", 400);
                }
            }

            const cohort = await this.cohortsRepository.update(id, data);

            await this.createAuditLogUseCase.execute({
                action: 'UPDATE',
                resource: 'COHORT',
                resourceId: cohort.id,
                details: { updatedFields: Object.keys(data) }
            }).catch(err => console.error("Failed to create audit log for cohort update", err));

            return cohort;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error updating cohort", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
