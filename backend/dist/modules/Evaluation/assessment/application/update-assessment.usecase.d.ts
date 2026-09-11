import { AssessmentRepository } from "../domain/assessment.repository.js";
import { UpdateAssessmentDTO } from "../domain/assessment.interfaces.js";
export declare class UpdateAssessmentUseCase {
    private readonly repository;
    constructor(repository: AssessmentRepository);
    execute(id: string, data: UpdateAssessmentDTO): Promise<import("../domain/assessment.entity.js").AssessmentEntity>;
}
//# sourceMappingURL=update-assessment.usecase.d.ts.map