import type { SubmissionRepository } from '../domain/submission.repository.js';
export declare class GradeSubmissionUseCase {
    private readonly submissionRepository;
    constructor(submissionRepository: SubmissionRepository);
    execute(id: string, totalScore: number, feedback?: string): Promise<import("../domain/submission.entity.js").SubmissionEntity | null>;
}
//# sourceMappingURL=grade-submission.usecase.d.ts.map