import type { AcademicCyclesRepository } from "../../cycle/domain/academicCycle.repository.js";
import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { GetAcademicCycle } from "../../cycle/domain/academicCycle.entity.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

interface CreateAcademicCycleRequest {
    tenantId: string;
    campusId: string;
    name: string;
    year: number;
    order: number;
    startDate: Date;
    endDate: Date;
    isCurrent?: boolean;
}

export class CreateAcademicCycleUseCase {
    constructor(
        private readonly academicCyclesRepository: AcademicCyclesRepository,
        private readonly campusesRepository: CampusesRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(data: CreateAcademicCycleRequest): Promise<GetAcademicCycle> {
        try {
            const campus = await this.campusesRepository.findById(data.campusId);
            if (!campus || campus.tenantId !== data.tenantId) {
                throw new AppError("Invalid campus", "INVALID_CAMPUS", 400);
            }

            if (data.startDate >= data.endDate) {
                throw new AppError("End date must be after start date", "INVALID_DATES", 400);
            }

            const cycle = await this.academicCyclesRepository.create({
                campusId: data.campusId,
                name: data.name,
                year: data.year,
                order: data.order,
                startDate: data.startDate,
                endDate: data.endDate,
                isCurrent: data.isCurrent
            });

            await this.createAuditLogUseCase.execute({
                action: 'CREATE',
                resource: 'ACADEMIC_CYCLE',
                resourceId: cycle.id,
                details: { name: cycle.name }
            }).catch((err: any) => console.error("Failed to create audit log for academic cycle creation", err));

            return cycle;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error creating academic cycle", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
