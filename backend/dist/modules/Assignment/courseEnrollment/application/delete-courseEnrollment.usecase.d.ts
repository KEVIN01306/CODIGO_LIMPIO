import { CourseEnrollmentRepository } from "../domain/courseEnrollment.repository.js";
import { CreateAuditLogUseCase } from "../../../Audit/application/create-audit-log.usecase.js";
export declare class DeleteCourseEnrollmentUseCase {
    private readonly repository;
    private readonly createAuditLogUseCase;
    constructor(repository: CourseEnrollmentRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=delete-courseEnrollment.usecase.d.ts.map