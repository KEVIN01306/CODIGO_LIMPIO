import type { CoursesRepository } from "../../course/domain/course.repository.js";
import type { AcademicProgramsRepository } from "../../program/domain/academicProgram.repository.js";
import type { GetCourse } from "../../course/domain/course.entity.js";
import type { CreateAuditLogUseCase } from "../../../Audit/application/create-audit-log.usecase.js";
interface UpdateCourseRequest {
    programId?: string;
    code?: string;
    name?: string;
    description?: string | null;
    credits?: number;
    isActive?: boolean;
}
export declare class UpdateCourseUseCase {
    private readonly coursesRepository;
    private readonly academicProgramsRepository;
    private readonly createAuditLogUseCase;
    constructor(coursesRepository: CoursesRepository, academicProgramsRepository: AcademicProgramsRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, data: UpdateCourseRequest, tenantId: string): Promise<GetCourse>;
}
export {};
//# sourceMappingURL=update-course.usecase.d.ts.map