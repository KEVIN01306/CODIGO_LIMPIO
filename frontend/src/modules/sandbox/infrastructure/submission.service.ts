import api from "../../../core/api/axios.config";

const API_URL = '/evaluations/submissions';

export const startSubmission = async (assessmentId: string): Promise<any> => {
  const response = await api.post(`${API_URL}/start`, { assessmentId });
  return response.data.data;
};

export const syncSubmission = async (
  id: string,
  data: { tabSwitchesCount?: number; clipboardAttempts?: number; codeSnapshot?: any }
): Promise<any> => {
  const response = await api.patch(`${API_URL}/${id}/sync`, data);
  return response.data.data;
};

export const finishSubmission = async (
  id: string,
  data?: { entryFile?: string; codeSnapshot?: Record<string, string> }
): Promise<any> => {
  const response = await api.post(`${API_URL}/${id}/finish`, data || {});
  return response.data.data;
};

export const getSubmissionById = async (id: string): Promise<any> => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data.data;
};

/**
 * Dedicated endpoint for persisting the student's code snapshot.
 * Uses PUT semantics — sends the full file map and replaces the stored snapshot.
 * The backend enforces ownership and IN_PROGRESS status.
 *
 * @param id           - The submission ID.
 * @param codeSnapshot - Full file map: { "src/main.ts": "content", ... }
 */
export const updateCodeSnapshot = async (
  id: string,
  codeSnapshot: Record<string, string>
): Promise<any> => {
  const response = await api.put(`${API_URL}/${id}/code`, { codeSnapshot });
  return response.data.data;
};

/**
 * Executes the student's current code snapshot on the backend.
 * Runtime errors (exceptions, bad exit code) are returned inside the response
 * body — they are NOT thrown as Axios errors.
 *
 * @param id           - The submission ID.
 * @param codeSnapshot - Full file map sent to the backend for execution.
 * @param entryFile    - The file path within the snapshot to run first.
 */
export const runCode = async (
  id: string,
  codeSnapshot: Record<string, string>,
  entryFile: string
): Promise<any> => {
  const response = await api.post(`${API_URL}/${id}/run`, { codeSnapshot, entryFile });
  return response.data.data;
};

export interface AssessmentStudentItem {
  enrollmentId: string;
  studentId: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  enrollmentStatus: string;
  hasSubmitted: boolean;
  submission: {
    id: string;
    status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'FLAGGED';
    startedAt: string;
    submittedAt: string | null;
    tabSwitchesCount: number;
    clipboardAttempts: number;
    testsPassedScore: number | null;
    aiQualityScore: number | null;
    totalScore: number | null;
    feedback: string | null;
    testOutput: any;
    codeSnapshot: Record<string, string> | null;
    chatHistory?: Array<{ role: 'user' | 'assistant'; content: string }> | null;
    filesCount: number;
  } | null;
}

export interface AssessmentSubmissionsResponse {
  assessment: {
    id: string;
    offeringId: string;
    title: string;
    description: string | null;
    type: string;
    maxScore: number;
    weight: number | null;
    dueDate: string | null;
    strictMode: boolean;
    allowedLanguage: string | null;
    timeLimitMinutes: number | null;
    course: {
      id: string;
      name: string;
      code: string;
    };
    offering: {
      id: string;
      section: string;
      cycle?: string;
      campus?: string;
    };
  };
  students: AssessmentStudentItem[];
  stats: {
    totalEnrolled: number;
    submittedCount: number;
    inProgressCount: number;
    notStartedCount: number;
    gradedCount: number;
    integrityViolationsCount: number;
  };
}

export const getAssessmentSubmissions = async (
  assessmentId: string
): Promise<AssessmentSubmissionsResponse> => {
  const response = await api.get(`${API_URL}/assessment/${assessmentId}`);
  return response.data.data;
};

export const gradeSubmission = async (
  submissionId: string,
  data: { totalScore: number; feedback?: string }
): Promise<any> => {
  const response = await api.patch(`${API_URL}/${submissionId}/grade`, data);
  return response.data.data;
};

export interface StudentEvaluationFinding {
  title: string;
  description: string;
  severity?: string;
}

export interface StudentSubmissionFeedback {
  submissionId: string;
  assessmentId: string;
  assessmentTitle: string;
  assessmentDescription: string | null;
  allowedLanguage: string;
  maxScore: number;
  weight: number | null;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'FLAGGED';
  startedAt: string;
  submittedAt: string | null;
  submittedCode: Record<string, string> | null;
  score: number | null;
  aiFeedback: string | null;
  teacherComments: string | null;
  evaluationFindings: StudentEvaluationFinding[];
  testsPassedScore: number | null;
  aiQualityScore: number | null;
  testOutput: any;
}

export interface MySubmissionItem {
  id: string;
  assessmentId: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'FLAGGED';
  startedAt: string;
  submittedAt: string | null;
  totalScore: number | null;
  maxScore?: number;
  assessmentTitle?: string;
  feedback?: string | null;
  hasCodeSnapshot: boolean;
}

export const getStudentSubmissionFeedback = async (
  submissionId: string
): Promise<StudentSubmissionFeedback> => {
  const response = await api.get(`${API_URL}/${submissionId}/feedback`);
  return response.data.data;
};

export const getStudentSubmissionFeedbackByAssessment = async (
  assessmentId: string
): Promise<StudentSubmissionFeedback> => {
  const response = await api.get(`${API_URL}/assessment/${assessmentId}/feedback`);
  return response.data.data;
};

export const getMySubmissions = async (params?: {
  offeringId?: string;
}): Promise<MySubmissionItem[]> => {
  const response = await api.get(`${API_URL}/my-submissions`, { params });
  return response.data.data;
};


