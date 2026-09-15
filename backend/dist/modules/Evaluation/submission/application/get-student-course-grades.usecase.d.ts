import type { SubmissionRepository } from '../domain/submission.repository.js';
export interface StudentEvaluationFinding {
    title: string;
    description: string;
    severity?: string;
}
export interface StudentAssessmentGradeItemDTO {
    assessmentId: string;
    title: string;
    description: string | null;
    type: string;
    maxScore: number;
    assessmentValue: number;
    submissionId: string | null;
    submissionStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'FLAGGED';
    score: number | null;
    equivalentPoints: number | null;
    percentage: number | null;
    aiFeedback: string | null;
    evaluationFindings: StudentEvaluationFinding[];
    dueDate: Date | null;
}
export interface CourseGradesSummaryDTO {
    totalPointsEarned: number;
    totalPossiblePoints: number;
    overallPercentage: number | null;
    evaluatedAssessmentsCount: number;
    totalAssessmentsCount: number;
}
export interface StudentCourseGradesResponseDTO {
    course: {
        id: string;
        name: string;
        code: string;
        section: string;
        offeringId: string;
    };
    grades: StudentAssessmentGradeItemDTO[];
    summary: CourseGradesSummaryDTO;
}
export declare class GetStudentCourseGradesUseCase {
    private readonly submissionRepo;
    constructor(submissionRepo: SubmissionRepository);
    private extractFindings;
    private extractAiFeedback;
    execute(userId: string, offeringId: string): Promise<StudentCourseGradesResponseDTO>;
}
//# sourceMappingURL=get-student-course-grades.usecase.d.ts.map