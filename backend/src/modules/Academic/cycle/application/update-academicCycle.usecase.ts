import type { AcademicCyclesRepository } from "../../cycle/domain/academicCycle.repository.js";
import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { GetAcademicCycle } from "../../cycle/domain/academicCycle.entity.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

interface UpdateAcademicCycleRequest {
    campusId?: string;
    name?: string;
    year?: number;
    order?: number;
    startDate?: Date;
    endDate?: Date;
    isCurrent?: boolean;
}

export class UpdateAcademicCycleUseCase {
    constructor(
        private readonly academicCyclesRepository: AcademicCyclesRepository,
        private readonly campusesRepository: CampusesRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string, data: UpdateAcademicCycleRequest, tenantId: string): Promise<GetAcademicCycle> {
        try {
            const cycle = await this.academicCyclesRepository.findById(id);
            if (!cycle) {
                throw new AppError("Academic cycle not found", "NOT_FOUND", 404);
            }

            if (cycle.campus?.tenantId !== tenantId) {
                throw new AppError("Academic cycle not found", "NOT_FOUND", 404);
            }

            if (data.campusId) {
                const campus = await this.campusesRepository.findById(data.campusId);
                if (!campus || campus.tenantId !== tenantId) {
                    throw new AppError("Invalid campus", "INVALID_CAMPUS", 400);
                }
            }

            const newStartDate = data.startDate || cycle.startDate;
            const newEndDate = data.endDate || cycle.endDate;

            if (newStartDate >= newEndDate) {
                throw new AppError("End date must be after start date", "INVALID_DATES", 400);
            }

            const updatedCycle = await this.academicCyclesRepository.update(id, {
                campusId: data.campusId,
                name: data.name,
                year: data.year,
                order: data.order,
                startDate: data.startDate,
                endDate: data.endDate,
                isCurrent: data.isCurrent
            });

            await this.createAuditLogUseCase.execute({
                action: 'UPDATE',
                resource: 'ACADEMIC_CYCLE',
                resourceId: updatedCycle.id,
                details: { changes: Object.keys(data) }
            }).catch((err: any) => console.error("Failed to create audit log for academic cycle update", err));

            return updatedCycle;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error updating academic cycle", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
