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
        public readonly student?: any
    ) {}
}
