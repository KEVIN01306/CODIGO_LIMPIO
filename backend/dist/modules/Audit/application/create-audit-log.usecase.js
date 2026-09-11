import AppError from "../../../shared/errors/AppError.js";
export class CreateAuditLogUseCase {
    auditRepository;
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }
    async execute(data) {
        try {
            return await this.auditRepository.create(data);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error creating audit log", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=create-audit-log.usecase.js.map