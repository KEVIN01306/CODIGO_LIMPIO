import { CourseOfferingRepository } from "../domain/courseOffering.repository.js";
import { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";
import AppError from "../../../../shared/errors/AppError.js";

export class UpdateCourseOfferingUseCase {
    constructor(
        private readonly repository: CourseOfferingRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string, data: any): Promise<any> {
        const entity = await this.repository.update(id, data);
        return entity;
    }
}
