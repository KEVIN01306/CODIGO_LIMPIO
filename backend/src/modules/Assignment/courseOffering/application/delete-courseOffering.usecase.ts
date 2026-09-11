import { CourseOfferingRepository } from "../domain/courseOffering.repository.js";
import { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";
import AppError from "../../../../shared/errors/AppError.js";

export class DeleteCourseOfferingUseCase {
    constructor(
        private readonly repository: CourseOfferingRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
