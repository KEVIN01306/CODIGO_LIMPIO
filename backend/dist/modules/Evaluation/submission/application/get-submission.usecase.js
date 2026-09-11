import AppError from '../../../../shared/errors/AppError.js';
export class GetSubmissionUseCase {
    submissionRepo;
    constructor(submissionRepo) {
        this.submissionRepo = submissionRepo;
    }
    async execute(id) {
        const submission = await this.submissionRepo.findById(id);
        if (!submission) {
            throw new AppError('Submission not found', 'NOT_FOUND', 404);
        }
        return submission;
    }
}
//# sourceMappingURL=get-submission.usecase.js.map