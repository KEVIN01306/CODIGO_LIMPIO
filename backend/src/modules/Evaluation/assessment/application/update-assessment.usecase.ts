import { AssessmentRepository } from "../domain/assessment.repository.js";
import { UpdateAssessmentDTO } from "../domain/assessment.interfaces.js";
import AppError from "@shared/errors/AppError.js";

export class UpdateAssessmentUseCase {
    constructor(private readonly repository: AssessmentRepository) { }

    async execute(id: string, data: UpdateAssessmentDTO) {
        const entity = await this.repository.update(id, data);
        if (!entity) throw new AppError('Assessment not found', 'NOT_FOUND', 404);
        return entity;
    }
}
