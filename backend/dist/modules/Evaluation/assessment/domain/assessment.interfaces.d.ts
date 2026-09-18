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
    requireSeb?: boolean;
    sebConfigKey?: string | null;
    sebConfigFilePath?: string | null;
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
    requireSeb?: boolean;
    sebConfigKey?: string | null;
    sebConfigFilePath?: string | null;
}
//# sourceMappingURL=assessment.interfaces.d.ts.map