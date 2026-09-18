export class AssessmentEntity {
    constructor(
        public readonly id: string,
        public readonly offeringId: string,
        public readonly title: string,
        public readonly type: 'QUIZ' | 'EXAM' | 'PROJECT' | 'HOMEWORK' | 'AI_INTERVIEW',
        public readonly maxScore: number,
        public readonly strictMode: boolean,
        public readonly description?: string,
        public readonly weight?: number,
        public readonly dueDate?: Date,
        public readonly timeLimitMinutes?: number,
        public readonly allowedLanguage?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
        public readonly offering?: any, // Can be typed fully if needed
        public readonly requireSeb: boolean = false,
        public readonly sebConfigKey?: string | null,
        public readonly sebConfigFilePath?: string | null
    ) {}
}
