import { CourseEnrollmentRepository } from "../domain/courseEnrollment.repository.js";
import { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";
import AppError from "@shared/errors/AppError.js";

export class CreateCourseEnrollmentUseCase {
    constructor(
        private readonly repository: CourseEnrollmentRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(data: any): Promise<any> {
        const entity = await this.repository.create(data);
        return entity;
    }
}
