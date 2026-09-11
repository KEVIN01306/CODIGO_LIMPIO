import { CourseEnrollmentRepository } from "../domain/courseEnrollment.repository.js";
import AppError from "@shared/errors/AppError.js";

export class GetCourseEnrollmentUseCase {
    constructor(
        private readonly repository: CourseEnrollmentRepository
    ) { }

    async execute(id: string): Promise<any> {
        const entity = await this.repository.findById(id);
        if (!entity) throw new AppError('CourseEnrollment not found', 'NOT_FOUND', 404);
        return entity;
    }
}
