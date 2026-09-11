import AppError from "@shared/errors/AppError.js";
import { UniqueConstraintError } from "@shared/db/database/errors/UniqueConstraintError.js";
export class CreateCampusUseCase {
    campusesRepository;
    createAuditLogUseCase;
    constructor(campusesRepository, createAuditLogUseCase) {
        this.campusesRepository = campusesRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(data) {
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
        }
        catch (error) {
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
//# sourceMappingURL=create-campus.usecase.js.map