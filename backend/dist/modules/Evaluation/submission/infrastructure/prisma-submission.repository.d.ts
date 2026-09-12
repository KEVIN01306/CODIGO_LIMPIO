import { PrismaClient } from '@prisma/client';
import { SubmissionRepository } from '../domain/submission.repository.js';
import { SubmissionEntity } from '../domain/submission.entity.js';
export declare class PrismaSubmissionRepository implements SubmissionRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private toEntity;
    findByAssessmentAndStudent(assessmentId: string, studentId: string): Promise<SubmissionEntity | null>;
    create(data: {
        assessmentId: string;
        studentId: string;
    }): Promise<SubmissionEntity>;
    update(id: string, data: any): Promise<SubmissionEntity | null>;
    findById(id: string): Promise<SubmissionEntity | null>;
    findByAssessment(assessmentId: string): Promise<SubmissionEntity[]>;
    updateGrade(id: string, totalScore: number, feedback?: string): Promise<SubmissionEntity | null>;
}
//# sourceMappingURL=prisma-submission.repository.d.ts.map