import { CourseEnrollmentRepository } from "../domain/courseEnrollment.repository.js";
import { CreateAuditLogUseCase } from "../../../Audit/application/create-audit-log.usecase.js";
export declare class CreateCourseEnrollmentUseCase {
    private readonly repository;
    private readonly createAuditLogUseCase;
    constructor(repository: CourseEnrollmentRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(data: any): Promise<any>;
}
//# sourceMappingURL=create-courseEnrollment.usecase.d.ts.map