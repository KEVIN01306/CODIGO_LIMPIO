import { AssessmentRepository } from "../domain/assessment.repository.js";
import AppError from "@shared/errors/AppError.js";

export class DeleteAssessmentUseCase {
    constructor(private readonly repository: AssessmentRepository) { }

    async execute(id: string) {
        const entity = await this.repository.findById(id);
        if (!entity) throw new AppError('Assessment not found', 'NOT_FOUND', 404);
        await this.repository.delete(id);
    }
}
