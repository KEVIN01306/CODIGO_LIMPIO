import { CourseEnrollmentRepository } from "../domain/courseEnrollment.repository.js";
import AppError from "../../../../shared/errors/AppError.js";

export class ListCourseEnrollmentsUseCase {
    constructor(
        private readonly repository: CourseEnrollmentRepository
    ) {}

    async execute(page: number, limit: number, filters?: any): Promise<any> {
        return await this.repository.findAll(page, limit, filters);
    }
}
