import { CourseEnrollmentRepository } from "../domain/courseEnrollment.repository.js";
export declare class ListCourseEnrollmentsUseCase {
    private readonly repository;
    constructor(repository: CourseEnrollmentRepository);
    execute(page: number, limit: number, filters?: any): Promise<any>;
}
//# sourceMappingURL=list-courseEnrollment.usecase.d.ts.map