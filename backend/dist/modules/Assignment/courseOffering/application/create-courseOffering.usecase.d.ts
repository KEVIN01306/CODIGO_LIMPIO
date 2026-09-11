import { CourseOfferingRepository } from "../domain/courseOffering.repository.js";
import { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";
export declare class CreateCourseOfferingUseCase {
    private readonly repository;
    private readonly createAuditLogUseCase;
    constructor(repository: CourseOfferingRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(data: any): Promise<any>;
}
//# sourceMappingURL=create-courseOffering.usecase.d.ts.map