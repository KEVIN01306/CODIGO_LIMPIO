import type { AuditRepository } from "../domain/audit.repository.js";
import type { AuditLog } from "../domain/audit-log.entity.js";
import AppError from "@shared/errors/AppError.js";

export class ListAuditLogsUseCase {
    constructor(private readonly auditRepository: AuditRepository) {}

    async execute(): Promise<AuditLog[]> {
        try {
            return await this.auditRepository.findAll();
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching audit logs", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
