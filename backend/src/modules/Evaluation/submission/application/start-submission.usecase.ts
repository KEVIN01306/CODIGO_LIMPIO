import { SubmissionRepository } from '../domain/submission.repository.js';
import { SubmissionEntity } from '../domain/submission.entity.js';
import AppError from '../../../../shared/errors/AppError.js';

export class StartSubmissionUseCase {
    constructor(private readonly submissionRepo: SubmissionRepository) { }

    async execute(assessmentId: string, studentId: string): Promise<SubmissionEntity> {
        // Check if submission already exists
        const existing = await this.submissionRepo.findByAssessmentAndStudent(assessmentId, studentId);
        if (existing) {
            return existing;
        }

        // Otherwise create a new one
        return await this.submissionRepo.create({ assessmentId, studentId });
    }
}
