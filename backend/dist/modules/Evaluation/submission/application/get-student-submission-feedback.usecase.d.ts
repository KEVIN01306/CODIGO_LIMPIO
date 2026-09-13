import type { SubmissionRepository } from '../domain/submission.repository.js';
export interface StudentEvaluationFinding {
    title: string;
    description: string;
    severity?: string;
}
export interface StudentSubmissionFeedbackDTO {
    submissionId: string;
    assessmentId: string;
    assessmentTitle: string;
    assessmentDescription: string | null;
    allowedLanguage: string;
    maxScore: number;
    weight: number | null;
    status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'FLAGGED';
    startedAt: Date;
    submittedAt: Date | null;
    submittedCode: Record<string, string> | null;
    score: number | null;
    teacherComments: string | null;
    evaluationFindings: StudentEvaluationFinding[];
    testsPassedScore: number | null;
    aiQualityScore: number | null;
    testOutput: any;
}
export declare class GetStudentSubmissionFeedbackUseCase {
    private readonly submissionRepo;
    constructor(submissionRepo: SubmissionRepository);
    /**
     * Helper to parse evaluation findings/mistakes from testOutput or aiFeedback.
     */
    private extractFindings;
    /**
     * Helper to extract teacher comments from aiFeedback or gradeRecord.
     */
    private extractTeacherComments;
    private formatResponse;
    /**
     * Retrieve feedback by submission ID, strictly verifying student ownership.
     */
    execute(submissionId: string, userId: string): Promise<StudentSubmissionFeedbackDTO>;
    /**
     * Retrieve feedback by assessment ID for the authenticated student.
     */
    executeByAssessment(assessmentId: string, userId: string): Promise<StudentSubmissionFeedbackDTO>;
}
//# sourceMappingURL=get-student-submission-feedback.usecase.d.ts.map