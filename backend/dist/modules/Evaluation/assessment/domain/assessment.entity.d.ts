export declare class AssessmentEntity {
    readonly id: string;
    readonly offeringId: string;
    readonly title: string;
    readonly type: 'QUIZ' | 'EXAM' | 'PROJECT' | 'HOMEWORK' | 'AI_INTERVIEW';
    readonly maxScore: number;
    readonly strictMode: boolean;
    readonly description?: string | undefined;
    readonly weight?: number | undefined;
    readonly dueDate?: Date | undefined;
    readonly timeLimitMinutes?: number | undefined;
    readonly allowedLanguage?: string | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    readonly offering?: any | undefined;
    constructor(id: string, offeringId: string, title: string, type: 'QUIZ' | 'EXAM' | 'PROJECT' | 'HOMEWORK' | 'AI_INTERVIEW', maxScore: number, strictMode: boolean, description?: string | undefined, weight?: number | undefined, dueDate?: Date | undefined, timeLimitMinutes?: number | undefined, allowedLanguage?: string | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined, offering?: any | undefined);
}
//# sourceMappingURL=assessment.entity.d.ts.map