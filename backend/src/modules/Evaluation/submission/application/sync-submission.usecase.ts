import { SubmissionRepository } from '../domain/submission.repository.js';
import { SubmissionEntity } from '../domain/submission.entity.js';
import AppError from '@shared/errors/AppError.js';

export class SyncSubmissionUseCase {
    constructor(private readonly submissionRepo: SubmissionRepository) { }

    async execute(id: string, data: { tabSwitchesCount?: number; clipboardAttempts?: number; codeSnapshot?: any }): Promise<SubmissionEntity> {
        const submission = await this.submissionRepo.findById(id);
        if (!submission) {
            throw new AppError('Submission not found', 'NOT_FOUND', 404);
        }

        if (submission.status !== 'IN_PROGRESS') {
            throw new AppError('Cannot sync a submission that is not in progress', 'BAD_REQUEST', 400);
        }

        const updateData: any = {};
        if (data.tabSwitchesCount !== undefined) {
            updateData.tabSwitchesCount = data.tabSwitchesCount;
        }
        if (data.clipboardAttempts !== undefined) {
            updateData.clipboardAttempts = data.clipboardAttempts;
        }
        if (data.codeSnapshot !== undefined) {
            updateData.codeSnapshot = data.codeSnapshot;
        }

        const updated = await this.submissionRepo.update(id, updateData);
        return updated!;
    }
}
