import { CourseEnrollmentRepository } from "../domain/courseEnrollment.repository.js";
import { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";
import AppError from "@shared/errors/AppError.js";

export class DeleteCourseEnrollmentUseCase {
    constructor(
        private readonly repository: CourseEnrollmentRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
