import { PrismaClient } from '@prisma/client';
import AppError from '../../../../shared/errors/AppError.js';
const prisma = new PrismaClient();
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
export class UpdateCodeSnapshotUseCase {
    submissionRepo;
    constructor(submissionRepo) {
        this.submissionRepo = submissionRepo;
    }
    /**
     * @param submissionId  - The ID of the submission to update.
     * @param userId        - The authenticated user's ID (from JWT payload).
     * @param codeSnapshot  - The full file map: { "path/file.ts": "content" }
     */
    async execute(submissionId, userId, codeSnapshot) {
        // 1. Verify the submission exists
        const submission = await this.submissionRepo.findById(submissionId);
        if (!submission) {
            throw new AppError('Submission not found', 'NOT_FOUND', 404);
        }
        // 2. Resolve the student profile for the calling user
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId }
        });
        if (!studentProfile) {
            throw new AppError('Only students can update a code snapshot', 'FORBIDDEN', 403);
        }
        // 3. Ownership check — the submission must belong to this student
        if (submission.studentId !== studentProfile.id) {
            throw new AppError('You are not authorized to update this submission', 'FORBIDDEN', 403);
        }
        // 4. Editability check — cannot update a finalized submission
        if (submission.status !== 'IN_PROGRESS') {
            throw new AppError('Cannot update a submission that is not in progress', 'BAD_REQUEST', 400);
        }
        // 5. Persist the latest snapshot
        const updated = await this.submissionRepo.update(submissionId, {
            codeSnapshot
        });
        return updated;
    }
}
//# sourceMappingURL=update-code-snapshot.usecase.js.map