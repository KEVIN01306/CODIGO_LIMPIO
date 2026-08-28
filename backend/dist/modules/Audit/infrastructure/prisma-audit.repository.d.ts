import type { PrismaClient } from "@prisma/client";
import type { AuditRepository } from "../domain/audit.repository.js";
import type { AuditLog, CreateAuditLog } from "../domain/audit-log.entity.js";
export declare class PrismaAuditRepository implements AuditRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(data: CreateAuditLog): Promise<AuditLog>;
    findAll(): Promise<AuditLog[]>;
}
//# sourceMappingURL=prisma-audit.repository.d.ts.map