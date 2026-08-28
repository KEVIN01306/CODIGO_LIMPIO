import type { AuditRepository } from "../domain/audit.repository.js";
import type { AuditLog, CreateAuditLog } from "../domain/audit-log.entity.js";
export declare class CreateAuditLogUseCase {
    private readonly auditRepository;
    constructor(auditRepository: AuditRepository);
    execute(data: CreateAuditLog): Promise<AuditLog>;
}
//# sourceMappingURL=create-audit-log.usecase.d.ts.map