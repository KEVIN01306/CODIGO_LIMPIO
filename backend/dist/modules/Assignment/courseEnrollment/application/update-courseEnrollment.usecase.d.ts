import { CourseEnrollmentRepository } from "../domain/courseEnrollment.repository.js";
import { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";
export declare class UpdateCourseEnrollmentUseCase {
    private readonly repository;
    private readonly createAuditLogUseCase;
    constructor(repository: CourseEnrollmentRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, data: any): Promise<any>;
}
//# sourceMappingURL=update-courseEnrollment.usecase.d.ts.map