import { SubmissionEntity } from './submission.entity.js';
export interface SubmissionRepository {
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
//# sourceMappingURL=submission.repository.d.ts.map