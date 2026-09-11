import type { CoursesRepository } from "../../course/domain/course.repository.js";
import type { CreateAuditLogUseCase } from "../../../Audit/application/create-audit-log.usecase.js";
export declare class DeleteCourseUseCase {
    private readonly coursesRepository;
    private readonly createAuditLogUseCase;
    constructor(coursesRepository: CoursesRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, tenantId: string): Promise<void>;
}
//# sourceMappingURL=delete-course.usecase.d.ts.map