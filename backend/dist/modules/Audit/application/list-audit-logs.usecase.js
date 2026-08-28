import AppError from "../../../shared/errors/AppError.js";
export class ListAuditLogsUseCase {
    auditRepository;
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }
    async execute() {
        try {
            return await this.auditRepository.findAll();
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching audit logs", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=list-audit-logs.usecase.js.map