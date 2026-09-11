export class StartSubmissionUseCase {
    submissionRepo;
    constructor(submissionRepo) {
        this.submissionRepo = submissionRepo;
    }
    async execute(assessmentId, studentId) {
        // Check if submission already exists
        const existing = await this.submissionRepo.findByAssessmentAndStudent(assessmentId, studentId);
        if (existing) {
            return existing;
        }
        // Otherwise create a new one
        return await this.submissionRepo.create({ assessmentId, studentId });
    }
}
//# sourceMappingURL=start-submission.usecase.js.map