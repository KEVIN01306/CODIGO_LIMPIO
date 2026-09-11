import AppError from "../../../shared/errors/AppError.js";
import { UniqueConstraintError } from "../../../shared/db/database/errors/UniqueConstraintError.js";
export class UpdateCampusUseCase {
    campusesRepository;
    createAuditLogUseCase;
    constructor(campusesRepository, createAuditLogUseCase) {
        this.campusesRepository = campusesRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id, data, tenantId) {
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
        }
        catch (error) {
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
//# sourceMappingURL=update-campus.usecase.js.map