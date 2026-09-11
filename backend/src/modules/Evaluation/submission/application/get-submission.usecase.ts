import { SubmissionRepository } from '../domain/submission.repository.js';
import { SubmissionEntity } from '../domain/submission.entity.js';
import AppError from '@shared/errors/AppError.js';

export class GetSubmissionUseCase {
    constructor(private readonly submissionRepo: SubmissionRepository) { }

    async execute(id: string): Promise<SubmissionEntity> {
        const submission = await this.submissionRepo.findById(id);
        if (!submission) {
            throw new AppError('Submission not found', 'NOT_FOUND', 404);
        }
        return submission;
    }
}
