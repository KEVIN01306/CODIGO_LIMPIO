import { PrismaAuditRepository } from "./infrastructure/prisma-audit.repository.js";
import { CreateAuditLogUseCase } from "./application/create-audit-log.usecase.js";
import { ListAuditLogsUseCase } from "./application/list-audit-logs.usecase.js";
import { AuditController } from "./presentation/audit.controller.js";
export declare const auditRepository: PrismaAuditRepository;
export declare const createAuditLogUseCase: CreateAuditLogUseCase;
export declare const listAuditLogsUseCase: ListAuditLogsUseCase;
export declare const auditController: AuditController;
//# sourceMappingURL=audit.module.d.ts.map