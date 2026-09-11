import type { CohortsRepository } from "../../cohort/domain/cohort.repository.js";
import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { AcademicProgramsRepository } from "../../program/domain/academicProgram.repository.js";
import type { GetCohort } from "../../cohort/domain/cohort.entity.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

interface CreateCohortRequest {
    tenantId: string;
    campusId: string;
    programId: string;
    name: string;
    startYear: number;
}

export class CreateCohortUseCase {
    constructor(
        private readonly cohortsRepository: CohortsRepository,
        private readonly campusesRepository: CampusesRepository,
        private readonly academicProgramsRepository: AcademicProgramsRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(data: CreateCohortRequest): Promise<GetCohort> {
        try {
            const campus = await this.campusesRepository.findById(data.campusId);
            if (!campus || campus.tenantId !== data.tenantId) {
                throw new AppError("Invalid campus", "INVALID_CAMPUS", 400);
            }

            const program = await this.academicProgramsRepository.findById(data.programId);
            if (!program || program.tenantId !== data.tenantId) {
                throw new AppError("Invalid academic program", "INVALID_PROGRAM", 400);
            }

            const cohort = await this.cohortsRepository.create(data);

            await this.createAuditLogUseCase.execute({
                action: 'CREATE',
                resource: 'COHORT',
                resourceId: cohort.id,
                details: { name: cohort.name }
            }).catch(err => console.error("Failed to create audit log for cohort creation", err));

            return cohort;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error creating cohort", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
