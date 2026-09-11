import { AssessmentRepository } from "../domain/assessment.repository.js";
export declare class DeleteAssessmentUseCase {
    private readonly repository;
    constructor(repository: AssessmentRepository);
    execute(id: string): Promise<void>;
}
//# sourceMappingURL=delete-assessment.usecase.d.ts.map