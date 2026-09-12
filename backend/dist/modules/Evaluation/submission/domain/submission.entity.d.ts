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
    readonly testsPassedScore?: number | null | undefined;
    readonly aiQualityScore?: number | null | undefined;
    readonly totalScore?: number | null | undefined;
    readonly testOutput?: any | undefined;
    readonly aiFeedback?: any | undefined;
    constructor(id: string, assessmentId: string, studentId: string, status: 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED' | 'FLAGGED', startedAt: Date, submittedAt: Date | null, tabSwitchesCount: number, clipboardAttempts: number, codeSnapshot: any, assessment?: any | undefined, student?: any | undefined, testsPassedScore?: number | null | undefined, aiQualityScore?: number | null | undefined, totalScore?: number | null | undefined, testOutput?: any | undefined, aiFeedback?: any | undefined);
}
//# sourceMappingURL=submission.entity.d.ts.map