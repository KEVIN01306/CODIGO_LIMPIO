import { CourseEnrollmentRepository } from "../domain/courseEnrollment.repository.js";
export declare class GetCourseEnrollmentUseCase {
    private readonly repository;
    constructor(repository: CourseEnrollmentRepository);
    execute(id: string): Promise<any>;
}
//# sourceMappingURL=get-courseEnrollment.usecase.d.ts.map