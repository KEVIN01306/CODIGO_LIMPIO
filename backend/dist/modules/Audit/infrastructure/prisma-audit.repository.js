import { PrismaErrorMapper } from "@shared/db/database/prisma/PrismaErrorMapper.js";
import { AuditMapper } from "./mappers/audit.mapper.js";
export class PrismaAuditRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            const auditLog = await this.prisma.auditLog.create({
                data: {
                    userId: data.userId,
                    action: data.action,
                    resource: data.resource,
                    resourceId: data.resourceId,
                    details: data.details ? data.details : undefined
                }
            });
            return AuditMapper.toDomain(auditLog);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findAll() {
        try {
            const logs = await this.prisma.auditLog.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return logs.map(log => AuditMapper.toDomain(log));
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
//# sourceMappingURL=prisma-audit.repository.js.map