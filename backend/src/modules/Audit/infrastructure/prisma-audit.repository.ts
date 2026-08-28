import type { PrismaClient } from "@prisma/client";
import type { AuditRepository } from "../domain/audit.repository.js";
import type { AuditLog, CreateAuditLog } from "../domain/audit-log.entity.js";
import { PrismaErrorMapper } from "@shared/db/database/prisma/PrismaErrorMapper.js";
import { AuditMapper } from "./mappers/audit.mapper.js";

export class PrismaAuditRepository implements AuditRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(data: CreateAuditLog): Promise<AuditLog> {
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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findAll(): Promise<AuditLog[]> {
        try {
            const logs = await this.prisma.auditLog.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return logs.map(log => AuditMapper.toDomain(log));
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
