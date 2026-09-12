import { SubmissionRepository } from '../domain/submission.repository.js';
import { SubmissionEntity } from '../domain/submission.entity.js';
/**
 * UpdateCodeSnapshotUseCase
 *
 * Dedicated use case for persisting the student's code files during an active
 * submission. Enforces:
 *   1. Submission existence.
 *   2. Ownership — the authenticated user must be the submitting student.
 *   3. Editability — status must be IN_PROGRESS.
 *
 * The `codeSnapshot` is stored as Record<string, string> where keys are
 * file paths and values are file contents (e.g. { "src/main.ts": "..." }).
 */
export declare class UpdateCodeSnapshotUseCase {
    private readonly submissionRepo;
    constructor(submissionRepo: SubmissionRepository);
    /**
     * @param submissionId  - The ID of the submission to update.
     * @param userId        - The authenticated user's ID (from JWT payload).
     * @param codeSnapshot  - The full file map: { "path/file.ts": "content" }
     */
    execute(submissionId: string, userId: string, codeSnapshot: Record<string, string>): Promise<SubmissionEntity>;
}
//# sourceMappingURL=update-code-snapshot.usecase.d.ts.map