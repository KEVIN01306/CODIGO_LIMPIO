export interface StudentEvaluationFinding {
  title: string;
  description: string;
  severity?: string;
}

export interface StudentAssessmentGradeItem {
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
  dueDate: string | null;
}

export interface CourseGradesSummary {
  totalPointsEarned: number;
  totalPossiblePoints: number;
  overallPercentage: number | null;
  evaluatedAssessmentsCount: number;
  totalAssessmentsCount: number;
}

export interface StudentCourseGradesResponse {
  course: {
    id: string;
    name: string;
    code: string;
    section: string;
    offeringId: string;
  };
  grades: StudentAssessmentGradeItem[];
  summary: CourseGradesSummary;
}
