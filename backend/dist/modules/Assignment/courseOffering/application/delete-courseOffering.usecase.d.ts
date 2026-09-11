import { CourseOfferingRepository } from "../domain/courseOffering.repository.js";
import { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";
export declare class DeleteCourseOfferingUseCase {
    private readonly repository;
    private readonly createAuditLogUseCase;
    constructor(repository: CourseOfferingRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=delete-courseOffering.usecase.d.ts.map