import { AssessmentRepository } from "../domain/assessment.repository.js";
export declare class ListAssessmentsUseCase {
    private readonly repository;
    constructor(repository: AssessmentRepository);
    execute(page: number, limit: number, filters?: any): Promise<{
        data: import("../domain/assessment.entity.js").AssessmentEntity[];
        total: number;
    }>;
}
//# sourceMappingURL=list-assessment.usecase.d.ts.map