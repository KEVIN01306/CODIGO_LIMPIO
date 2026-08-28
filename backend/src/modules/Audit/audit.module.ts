import { PrismaClient } from "@prisma/client";
import { PrismaAuditRepository } from "./infrastructure/prisma-audit.repository.js";
import { CreateAuditLogUseCase } from "./application/create-audit-log.usecase.js";
import { ListAuditLogsUseCase } from "./application/list-audit-logs.usecase.js";
import { AuditController } from "./presentation/audit.controller.js";

const prisma = new PrismaClient();

export const auditRepository = new PrismaAuditRepository(prisma);

export const createAuditLogUseCase = new CreateAuditLogUseCase(auditRepository);
export const listAuditLogsUseCase = new ListAuditLogsUseCase(auditRepository);

export const auditController = new AuditController(listAuditLogsUseCase);
