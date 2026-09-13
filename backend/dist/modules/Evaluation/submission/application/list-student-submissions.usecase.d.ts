import type { SubmissionRepository } from '../domain/submission.repository.js';
export interface StudentSubmissionSummaryItem {
    id: string;
    assessmentId: string;
    status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'FLAGGED';
    startedAt: Date;
    submittedAt: Date | null;
    totalScore: number | null;
    maxScore?: number;
    assessmentTitle?: string;
    feedback?: string | null;
    hasCodeSnapshot: boolean;
}
export declare class ListStudentSubmissionsUseCase {
    private readonly submissionRepo;
    constructor(submissionRepo: SubmissionRepository);
    execute(userId: string, offeringId?: string): Promise<StudentSubmissionSummaryItem[]>;
}
//# sourceMappingURL=list-student-submissions.usecase.d.ts.map