import type { AuditRepository } from "../domain/audit.repository.js";
import type { AuditLog } from "../domain/audit-log.entity.js";
export declare class ListAuditLogsUseCase {
    private readonly auditRepository;
    constructor(auditRepository: AuditRepository);
    execute(): Promise<AuditLog[]>;
}
//# sourceMappingURL=list-audit-logs.usecase.d.ts.map