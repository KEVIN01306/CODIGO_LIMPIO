import { SubmissionRepository } from '../domain/submission.repository.js';
import { SubmissionEntity } from '../domain/submission.entity.js';
export declare class FinishSubmissionUseCase {
    private readonly submissionRepo;
    constructor(submissionRepo: SubmissionRepository);
    execute(id: string): Promise<SubmissionEntity>;
}
//# sourceMappingURL=finish-submission.usecase.d.ts.map