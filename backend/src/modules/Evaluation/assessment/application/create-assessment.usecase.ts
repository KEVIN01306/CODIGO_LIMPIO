import { AssessmentRepository } from "../domain/assessment.repository.js";
import { CreateAssessmentDTO } from "../domain/assessment.interfaces.js";

export class CreateAssessmentUseCase {
    constructor(private readonly repository: AssessmentRepository) { }

    async execute(data: CreateAssessmentDTO) {
        return await this.repository.create(data);
    }
}
