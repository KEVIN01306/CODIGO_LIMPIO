import AppError from '../../../../shared/errors/AppError.js';
export class SyncSubmissionUseCase {
    submissionRepo;
    constructor(submissionRepo) {
        this.submissionRepo = submissionRepo;
    }
    async execute(id, data) {
        const submission = await this.submissionRepo.findById(id);
        if (!submission) {
            throw new AppError('Submission not found', 'NOT_FOUND', 404);
        }
        if (submission.status !== 'IN_PROGRESS') {
            throw new AppError('Cannot sync a submission that is not in progress', 'BAD_REQUEST', 400);
        }
        const updateData = {};
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
        return updated;
    }
}
//# sourceMappingURL=sync-submission.usecase.js.map