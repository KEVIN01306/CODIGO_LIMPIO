import { SubmissionRepository } from '../domain/submission.repository.js';
import { SubmissionEntity } from '../domain/submission.entity.js';
export declare class GetSubmissionUseCase {
    private readonly submissionRepo;
    constructor(submissionRepo: SubmissionRepository);
    execute(id: string): Promise<SubmissionEntity>;
}
//# sourceMappingURL=get-submission.usecase.d.ts.map