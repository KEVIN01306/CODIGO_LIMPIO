import type { AuditLog, CreateAuditLog } from "./audit-log.entity.js";

export interface AuditRepository {
    create(data: CreateAuditLog): Promise<AuditLog>;
    findAll(): Promise<AuditLog[]>;
}
