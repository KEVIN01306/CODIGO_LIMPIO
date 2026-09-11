export interface CreateAssessmentDTO {
    offeringId: string;
    title: string;
    description?: string;
    type: 'QUIZ' | 'EXAM' | 'PROJECT' | 'HOMEWORK' | 'AI_INTERVIEW';
    maxScore: number;
    weight?: number;
    dueDate?: string | Date;
    timeLimitMinutes?: number;
    allowedLanguage?: string;
    strictMode?: boolean;
}

export interface UpdateAssessmentDTO {
    title?: string;
    description?: string;
    type?: 'QUIZ' | 'EXAM' | 'PROJECT' | 'HOMEWORK' | 'AI_INTERVIEW';
    maxScore?: number;
    weight?: number;
    dueDate?: string | Date;
    timeLimitMinutes?: number;
    allowedLanguage?: string;
    strictMode?: boolean;
}
