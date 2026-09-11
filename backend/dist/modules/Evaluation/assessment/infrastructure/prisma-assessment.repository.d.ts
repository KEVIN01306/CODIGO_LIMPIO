import { PrismaClient } from "@prisma/client";
import { AssessmentRepository } from "../domain/assessment.repository.js";
import { AssessmentEntity } from "../domain/assessment.entity.js";
import { CreateAssessmentDTO, UpdateAssessmentDTO } from "../domain/assessment.interfaces.js";
export declare class PrismaAssessmentRepository implements AssessmentRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private toEntity;
    create(data: CreateAssessmentDTO): Promise<AssessmentEntity>;
    update(id: string, data: UpdateAssessmentDTO): Promise<AssessmentEntity | null>;
    findById(id: string): Promise<AssessmentEntity | null>;
    findAll(page: number, limit: number, filters?: any): Promise<{
        data: AssessmentEntity[];
        total: number;
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=prisma-assessment.repository.d.ts.map