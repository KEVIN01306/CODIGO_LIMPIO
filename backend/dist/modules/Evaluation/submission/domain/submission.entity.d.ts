export declare class SubmissionEntity {
    readonly id: string;
    readonly assessmentId: string;
    readonly studentId: string;
    readonly status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'FLAGGED';
    readonly startedAt: Date;
    readonly submittedAt: Date | null;
    readonly tabSwitchesCount: number;
    readonly clipboardAttempts: number;
    readonly codeSnapshot: any;
    readonly assessment?: any | undefined;
    readonly student?: any | undefined;
    constructor(id: string, assessmentId: string, studentId: string, status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'FLAGGED', startedAt: Date, submittedAt: Date | null, tabSwitchesCount: number, clipboardAttempts: number, codeSnapshot: any, assessment?: any | undefined, student?: any | undefined);
}
//# sourceMappingURL=submission.entity.d.ts.map