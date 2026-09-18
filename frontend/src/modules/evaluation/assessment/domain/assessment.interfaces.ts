export interface Assessment {
  id: string;
  offeringId: string;
  title: string;
  description?: string;
  type: 'QUIZ' | 'EXAM' | 'PROJECT' | 'HOMEWORK' | 'AI_INTERVIEW';
  maxScore: number;
  weight?: number;
  dueDate?: string;
  timeLimitMinutes?: number;
  allowedLanguage?: string;
  strictMode: boolean;
  requireSeb?: boolean;
  sebConfigKey?: string | null;
  sebConfigFilePath?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssessmentDTO {
  offeringId: string;
  title: string;
  description?: string;
  type: 'QUIZ' | 'EXAM' | 'PROJECT' | 'HOMEWORK' | 'AI_INTERVIEW';
  maxScore: number;
  weight?: number;
  dueDate?: string;
  timeLimitMinutes?: number;
  allowedLanguage?: string;
  strictMode?: boolean;
  requireSeb?: boolean;
  sebConfigKey?: string;
  sebConfigFile?: File | null;
  sebConfigFilePath?: string | null;
}

export interface UpdateAssessmentDTO extends Partial<CreateAssessmentDTO> { }

export type AssessmentFormValues = CreateAssessmentDTO;
