import { AssessmentRepository } from "../domain/assessment.repository.js";
export declare class GetAssessmentUseCase {
    private readonly repository;
    constructor(repository: AssessmentRepository);
    execute(id: string): Promise<import("../domain/assessment.entity.js").AssessmentEntity>;
}
//# sourceMappingURL=get-assessment.usecase.d.ts.map