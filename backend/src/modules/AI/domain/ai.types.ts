export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface WorkspaceContext {
  currentCode: string;
  language: string;
  lastExecutionOutput?: string | null;
  exerciseGoal: string;
}

export interface AiChatRequestDTO {
  studentPrompt: string;
  chatHistory: ChatMessage[];
  workspaceContext: WorkspaceContext;
}

export interface AssessmentGradingProblem {
  title: string;
  description: string | null;
  maxScore: number;
  allowedLanguage?: string;
}

export interface StudentSubmissionGrading {
  code: string;
  codeTree: string;
  mistakes: any[];
}

export interface GradingExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
}

export interface GradeAssessmentInputDTO {
  problem: AssessmentGradingProblem;
  studentSubmission: StudentSubmissionGrading;
  executionResult: GradingExecutionResult;
}

export interface GradingResultDTO {
  totalScore: number;
  aiFeedback: string;
}
