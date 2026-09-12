import type { SubmissionRepository } from '../domain/submission.repository.js';
import AppError from '@shared/errors/AppError.js';

export class GradeSubmissionUseCase {
    constructor(private readonly submissionRepository: SubmissionRepository) {}

    async execute(id: string, totalScore: number, feedback?: string) {
        const submission = await this.submissionRepository.findById(id);
        if (!submission) {
            throw new AppError('Submission not found', 'NOT_FOUND', 404);
        }

        if (totalScore < 0) {
            throw new AppError('Grade score cannot be negative', 'BAD_REQUEST', 400);
        }

        if (submission.assessment?.maxScore && totalScore > Number(submission.assessment.maxScore)) {
            throw new AppError(`Grade score cannot exceed maximum score of ${submission.assessment.maxScore}`, 'BAD_REQUEST', 400);
        }

        const updated = await this.submissionRepository.updateGrade(id, totalScore, feedback);
        return updated;
    }
}
