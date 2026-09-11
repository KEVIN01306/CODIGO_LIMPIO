import { CourseOfferingRepository } from "../domain/courseOffering.repository.js";
import { CreateAuditLogUseCase } from "../../../Audit/application/create-audit-log.usecase.js";
export declare class UpdateCourseOfferingUseCase {
    private readonly repository;
    private readonly createAuditLogUseCase;
    constructor(repository: CourseOfferingRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, data: any): Promise<any>;
}
//# sourceMappingURL=update-courseOffering.usecase.d.ts.map