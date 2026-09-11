import type { CampusesRepository } from "../domain/campus.repository.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
export declare class DeleteCampusUseCase {
    private readonly campusesRepository;
    private readonly createAuditLogUseCase;
    constructor(campusesRepository: CampusesRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, tenantId: string): Promise<void>;
}
//# sourceMappingURL=delete-campus.usecase.d.ts.map