import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { GetCampus } from "../../campus/domain/campus.entity.js";
import AppError from "@shared/errors/AppError.js";
import { UniqueConstraintError } from "@shared/db/database/errors/UniqueConstraintError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

interface CreateCampusRequest {
    tenantId: string;
    code: string;
    name: string;
    address: string | null;
}

export class CreateCampusUseCase {
    constructor(
        private readonly campusesRepository: CampusesRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(data: CreateCampusRequest): Promise<GetCampus> {
        try {
            const existing = await this.campusesRepository.findByCode(data.tenantId, data.code);
            if (existing) {
                throw new AppError("Campus code already exists", "CODE_ALREADY_EXISTS", 400);
            }

            const campus = await this.campusesRepository.create(data);

            await this.createAuditLogUseCase.execute({
                action: 'CREATE',
                resource: 'CAMPUS',
                resourceId: campus.id,
                details: { code: campus.code, name: campus.name }
            }).catch(err => console.error("Failed to create audit log for campus creation", err));

            return campus;
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new AppError("Campus code already exists", "CODE_ALREADY_EXISTS", 400);
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error creating campus", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
