import type { CampusesRepository } from "../domain/campus.repository.js";
import type { GetCampus } from "../domain/campus.entity.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
interface UpdateCampusRequest {
    code?: string;
    name?: string;
    address?: string | null;
    isActive?: boolean;
}
export declare class UpdateCampusUseCase {
    private readonly campusesRepository;
    private readonly createAuditLogUseCase;
    constructor(campusesRepository: CampusesRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, data: UpdateCampusRequest, tenantId: string): Promise<GetCampus>;
}
export {};
//# sourceMappingURL=update-campus.usecase.d.ts.map