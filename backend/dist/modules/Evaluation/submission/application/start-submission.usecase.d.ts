import { SubmissionRepository } from '../domain/submission.repository.js';
import { SubmissionEntity } from '../domain/submission.entity.js';
export declare class StartSubmissionUseCase {
    private readonly submissionRepo;
    constructor(submissionRepo: SubmissionRepository);
    execute(assessmentId: string, studentId: string): Promise<SubmissionEntity>;
}
//# sourceMappingURL=start-submission.usecase.d.ts.map