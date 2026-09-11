import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { GetCampus } from "../../campus/domain/campus.entity.js";
import AppError from "@shared/errors/AppError.js";
import { UniqueConstraintError } from "@shared/db/database/errors/UniqueConstraintError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

interface UpdateCampusRequest {
    code?: string;
    name?: string;
    address?: string | null;
    isActive?: boolean;
}

export class UpdateCampusUseCase {
    constructor(
        private readonly campusesRepository: CampusesRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string, data: UpdateCampusRequest, tenantId: string): Promise<GetCampus> {
        try {
            const existing = await this.campusesRepository.findById(id);
            if (!existing || existing.tenantId !== tenantId) {
                throw new AppError("Campus not found", "NOT_FOUND", 404);
            }

            if (data.code && data.code !== existing.code) {
                const codeExists = await this.campusesRepository.findByCode(tenantId, data.code);
                if (codeExists) {
                    throw new AppError("Campus code already exists", "CODE_ALREADY_EXISTS", 400);
                }
            }

            const campus = await this.campusesRepository.update(id, data);

            await this.createAuditLogUseCase.execute({
                action: 'UPDATE',
                resource: 'CAMPUS',
                resourceId: campus.id,
                details: { updatedFields: Object.keys(data) }
            }).catch(err => console.error("Failed to create audit log for campus update", err));

            return campus;
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new AppError("Campus code already exists", "CODE_ALREADY_EXISTS", 400);
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error updating campus", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
