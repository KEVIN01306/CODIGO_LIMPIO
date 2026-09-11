import type { CoursesRepository } from "../../course/domain/course.repository.js";
import type { AcademicProgramsRepository } from "../../program/domain/academicProgram.repository.js";
import type { GetCourse } from "../../course/domain/course.entity.js";
import type { CreateAuditLogUseCase } from "../../../Audit/application/create-audit-log.usecase.js";
interface CreateCourseRequest {
    tenantId: string;
    programId: string;
    code: string;
    name: string;
    description: string | null;
    credits: number;
}
export declare class CreateCourseUseCase {
    private readonly coursesRepository;
    private readonly academicProgramsRepository;
    private readonly createAuditLogUseCase;
    constructor(coursesRepository: CoursesRepository, academicProgramsRepository: AcademicProgramsRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(data: CreateCourseRequest): Promise<GetCourse>;
}
export {};
//# sourceMappingURL=create-course.usecase.d.ts.map