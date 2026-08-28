import type { AuditRepository } from "../domain/audit.repository.js";
import type { AuditLog, CreateAuditLog } from "../domain/audit-log.entity.js";
import AppError from "@shared/errors/AppError.js";

export class CreateAuditLogUseCase {
    constructor(private readonly auditRepository: AuditRepository) {}

    async execute(data: CreateAuditLog): Promise<AuditLog> {
        try {
            return await this.auditRepository.create(data);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error creating audit log", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
