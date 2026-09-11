import { SubmissionRepository } from '../domain/submission.repository.js';
import { SubmissionEntity } from '../domain/submission.entity.js';
export declare class SyncSubmissionUseCase {
    private readonly submissionRepo;
    constructor(submissionRepo: SubmissionRepository);
    execute(id: string, data: {
        tabSwitchesCount?: number;
        clipboardAttempts?: number;
        codeSnapshot?: any;
    }): Promise<SubmissionEntity>;
}
//# sourceMappingURL=sync-submission.usecase.d.ts.map