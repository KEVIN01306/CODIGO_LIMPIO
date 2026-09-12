import { SubmissionRepository } from '../domain/submission.repository.js';
/** Shape returned to the frontend. */
export interface CodeExecutionResult {
    success: boolean;
    stdout: string;
    stderr: string;
    exitCode: number | null;
    executionTimeMs: number;
}
/**
 * RunCodeUseCase
 *
 * Executes the student's current code snapshot in a child process.
 *
 * Security guarantees enforced BEFORE execution:
 *   1. Submission must exist.
 *   2. Calling user must be a student (StudentProfile exists).
 *   3. Submission must belong to that student (ownership).
 *   4. Submission must be IN_PROGRESS (not yet finalized).
 *
 * Execution is sandboxed by:
 *   - A dedicated temp directory (cleaned up after every run).
 *   - A hard 10-second timeout (child process is killed on expiry).
 *   - No network or filesystem access restrictions beyond what the OS provides.
 *
 * Runtime errors (bad syntax, exceptions, non-zero exit code) are returned
 * as part of the result — they are NOT thrown as AppErrors.
 * Infrastructure errors (spawn failure, auth failure) ARE thrown.
 */
export declare class RunCodeUseCase {
    private readonly submissionRepo;
    constructor(submissionRepo: SubmissionRepository);
    execute(submissionId: string, userId: string, codeSnapshot: Record<string, string>, entryFile: string): Promise<CodeExecutionResult>;
    /** Writes files to a temp dir, executes, and cleans up. */
    private runInSandbox;
    private spawnWithTimeout;
}
//# sourceMappingURL=run-code.usecase.d.ts.map