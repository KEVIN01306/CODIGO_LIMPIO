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
}

export interface UpdateAssessmentDTO extends Partial<CreateAssessmentDTO> { }

export type AssessmentFormValues = CreateAssessmentDTO;
