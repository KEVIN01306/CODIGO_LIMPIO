import { AssessmentRepository } from "../domain/assessment.repository.js";

export class ListAssessmentsUseCase {
    constructor(private readonly repository: AssessmentRepository) { }

    async execute(page: number, limit: number, filters?: any) {
        return await this.repository.findAll(page, limit, filters);
    }
}
