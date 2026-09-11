import type { CampusesRepository } from "../domain/campus.repository.js";
import type { GetCampus } from "../domain/campus.entity.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
interface CreateCampusRequest {
    tenantId: string;
    code: string;
    name: string;
    address: string | null;
}
export declare class CreateCampusUseCase {
    private readonly campusesRepository;
    private readonly createAuditLogUseCase;
    constructor(campusesRepository: CampusesRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(data: CreateCampusRequest): Promise<GetCampus>;
}
export {};
//# sourceMappingURL=create-campus.usecase.d.ts.map