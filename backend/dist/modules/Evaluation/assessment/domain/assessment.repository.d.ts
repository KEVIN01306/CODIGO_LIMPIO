import { AssessmentEntity } from "./assessment.entity.js";
import { CreateAssessmentDTO, UpdateAssessmentDTO } from "./assessment.interfaces.js";
export interface AssessmentRepository {
    create(data: CreateAssessmentDTO): Promise<AssessmentEntity>;
    update(id: string, data: UpdateAssessmentDTO): Promise<AssessmentEntity | null>;
    findById(id: string): Promise<AssessmentEntity | null>;
    findAll(page: number, limit: number, filters?: any): Promise<{
        data: AssessmentEntity[];
        total: number;
    }>;
    delete(id: string): Promise<void>;
    getOfferingTenantId(offeringId: string): Promise<string | null>;
}
//# sourceMappingURL=assessment.repository.d.ts.map