export class SubmissionEntity {
    constructor(
        public readonly id: string,
        public readonly assessmentId: string,
        public readonly studentId: string,
        public readonly status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'FLAGGED',
        public readonly startedAt: Date,
        public readonly submittedAt: Date | null,
        public readonly tabSwitchesCount: number,
        public readonly clipboardAttempts: number,
        public readonly codeSnapshot: any,
        public readonly assessment?: any,
        public readonly student?: any,
        public readonly testsPassedScore?: number | null,
        public readonly aiQualityScore?: number | null,
        public readonly totalScore?: number | null,
        public readonly testOutput?: any,
        public readonly aiFeedback?: any,
        public readonly chatHistory?: any
    ) {}
}
