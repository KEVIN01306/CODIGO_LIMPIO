import { AssessmentRepository } from "../domain/assessment.repository.js";
import { CreateAssessmentDTO } from "../domain/assessment.interfaces.js";
export declare class CreateAssessmentUseCase {
    private readonly repository;
    constructor(repository: AssessmentRepository);
    execute(data: CreateAssessmentDTO): Promise<import("../domain/assessment.entity.js").AssessmentEntity>;
}
//# sourceMappingURL=create-assessment.usecase.d.ts.map