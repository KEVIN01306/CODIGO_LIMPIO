import { submissionEventBus } from '../infrastructure/submission-events.bus.js';
import AppError from '../../../../shared/errors/AppError.js';
export class FinishSubmissionUseCase {
    submissionRepo;
    runCodeUseCase;
    gradeAssessmentUseCase;
    prisma;
    constructor(submissionRepo, runCodeUseCase, gradeAssessmentUseCase, prisma) {
        this.submissionRepo = submissionRepo;
        this.runCodeUseCase = runCodeUseCase;
        this.gradeAssessmentUseCase = gradeAssessmentUseCase;
        this.prisma = prisma;
    }
    async execute(id, userId, options) {
        // 1. Verify submission exists
        const submission = await this.submissionRepo.findById(id);
        if (!submission) {
            throw new AppError('Submission not found', 'NOT_FOUND', 404);
        }
        // 2. Resolve student profile and enforce ownership
        const studentProfile = await this.prisma.studentProfile.findUnique({
            where: { userId }
        });
        if (!studentProfile) {
            throw new AppError('Only students can submit assessments', 'FORBIDDEN', 403);
        }
        if (submission.studentId !== studentProfile.id) {
            throw new AppError('You are not authorized to submit this assessment', 'FORBIDDEN', 403);
        }
        // 3. Status check — must be IN_PROGRESS
        if (submission.status !== 'IN_PROGRESS') {
            throw new AppError('Submission is already completed or not in progress', 'BAD_REQUEST', 400);
        }
        // 4. Synchronize latest student code snapshot
        let activeSnapshot = {};
        if (options?.codeSnapshot && typeof options.codeSnapshot === 'object' && Object.keys(options.codeSnapshot).length > 0) {
            await this.submissionRepo.update(id, { codeSnapshot: options.codeSnapshot });
            activeSnapshot = options.codeSnapshot;
        }
        else if (submission.codeSnapshot && typeof submission.codeSnapshot === 'object') {
            activeSnapshot = submission.codeSnapshot;
        }
        const fileKeys = Object.keys(activeSnapshot);
        if (fileKeys.length === 0) {
            throw new AppError('Cannot submit an empty code snapshot', 'BAD_REQUEST', 400);
        }
        // 5. Determine entry file for execution
        const allowedLanguage = submission.assessment?.allowedLanguage || 'javascript';
        let entryFile = options?.entryFile?.trim();
        if (!entryFile || activeSnapshot[entryFile] === undefined) {
            entryFile = this.inferEntryFile(activeSnapshot, allowedLanguage);
        }
        if (!entryFile || activeSnapshot[entryFile] === undefined) {
            throw new AppError(`Could not determine an executable entry file in the submitted snapshot`, 'BAD_REQUEST', 400);
        }
        // 6. Execute code using the existing RunCodeUseCase
        let executionResult;
        try {
            executionResult = await this.runCodeUseCase.execute(id, userId, activeSnapshot, entryFile);
        }
        catch (runErr) {
            // Infrastructure/spawn errors propagate as AppError
            console.error('[FinishSubmissionUseCase] Code execution error:', runErr);
            throw runErr instanceof AppError
                ? runErr
                : new AppError(`Code execution failed: ${runErr.message}`, 'EXECUTION_FAILED', 500);
        }
        // 7. Prepare context for AI grading
        const assessment = submission.assessment;
        const maxScore = assessment?.maxScore ? Number(assessment.maxScore) : 100;
        const title = assessment?.title || 'Assessment';
        const description = assessment?.description || null;
        // Gather mistakes / faults
        const mistakes = [];
        if (!executionResult.success || (executionResult.exitCode !== null && executionResult.exitCode !== 0)) {
            mistakes.push({
                title: 'Runtime / Compilation Execution Failure',
                description: executionResult.stderr?.trim() || `Process exited with code ${executionResult.exitCode}`,
                severity: 'error'
            });
        }
        // Include any preexisting testOutput failures
        if (submission.testOutput && typeof submission.testOutput === 'object') {
            if (Array.isArray(submission.testOutput.failures)) {
                for (const f of submission.testOutput.failures) {
                    mistakes.push({
                        title: f.title || f.name || 'Test Failure',
                        description: f.message || f.error || JSON.stringify(f),
                        severity: 'error'
                    });
                }
            }
        }
        const codeTree = this.formatFileTree(fileKeys);
        const code = this.formatStudentCode(activeSnapshot);
        // 8. Call AI Grading Use Case
        let gradingResult = null;
        try {
            gradingResult = await this.gradeAssessmentUseCase.execute({
                problem: {
                    title,
                    description,
                    maxScore,
                    allowedLanguage
                },
                studentSubmission: {
                    code,
                    codeTree,
                    mistakes
                },
                executionResult
            });
        }
        catch (aiErr) {
            console.warn('[FinishSubmissionUseCase] AI Grading service unavailable. Falling back to SUBMITTED status:', aiErr?.message || aiErr);
        }
        if (!gradingResult) {
            // Safe fallback: preserve student submission with SUBMITTED status for teacher manual grading
            const submitted = await this.submissionRepo.update(id, {
                status: 'SUBMITTED',
                submittedAt: new Date(),
                testOutput: executionResult
            });
            return submitted || submission;
        }
        // 9. Persist successful evaluation in Submission
        const updated = await this.submissionRepo.update(id, {
            status: 'EVALUATED',
            submittedAt: new Date(),
            totalScore: gradingResult.totalScore,
            aiFeedback: gradingResult.aiFeedback,
            testOutput: executionResult
        });
        // 10. Sync GradeRecord in grade_records table for the official gradebook
        try {
            if (assessment?.offeringId && studentProfile.id) {
                const enrollment = await this.prisma.courseEnrollment.findFirst({
                    where: {
                        offeringId: assessment.offeringId,
                        studentId: studentProfile.id
                    }
                });
                if (enrollment) {
                    await this.prisma.gradeRecord.upsert({
                        where: {
                            enrollmentId_assessmentId: {
                                enrollmentId: enrollment.id,
                                assessmentId: submission.assessmentId
                            }
                        },
                        create: {
                            enrollmentId: enrollment.id,
                            assessmentId: submission.assessmentId,
                            score: gradingResult.totalScore,
                            feedback: gradingResult.aiFeedback,
                            isOverridden: false
                        },
                        update: {
                            score: gradingResult.totalScore,
                            feedback: gradingResult.aiFeedback,
                            isOverridden: false
                        }
                    });
                }
            }
        }
        catch (gradeSyncErr) {
            console.warn('[FinishSubmissionUseCase] Could not sync GradeRecord:', gradeSyncErr);
        }
        // 11. Broadcast real-time SUBMISSION_GRADED event
        try {
            submissionEventBus.publish({
                type: 'SUBMISSION_GRADED',
                submissionId: id,
                totalScore: gradingResult.totalScore,
                feedback: gradingResult.aiFeedback,
                status: 'EVALUATED',
                timestamp: new Date().toISOString()
            });
        }
        catch (busErr) {
            console.warn('[FinishSubmissionUseCase] Could not broadcast SUBMISSION_GRADED event:', busErr);
        }
        return updated;
    }
    inferEntryFile(snapshot, language) {
        const files = Object.keys(snapshot);
        if (files.length === 0)
            return '';
        const candidates = [
            'src/index.ts', 'src/main.ts', 'index.ts', 'main.ts',
            'src/index.js', 'src/main.js', 'index.js', 'main.js',
            'main.py', 'app.py', 'index.py'
        ];
        for (const c of candidates) {
            if (snapshot[c] !== undefined)
                return c;
        }
        const lang = (language || '').toLowerCase();
        if (lang.includes('python') || lang.includes('py')) {
            const py = files.find(f => f.endsWith('.py'));
            if (py)
                return py;
        }
        if (lang.includes('typescript') || lang.includes('ts')) {
            const ts = files.find(f => f.endsWith('.ts') && !f.endsWith('.d.ts'));
            if (ts)
                return ts;
        }
        if (lang.includes('javascript') || lang.includes('js')) {
            const js = files.find(f => f.endsWith('.js'));
            if (js)
                return js;
        }
        return files[0] || '';
    }
    formatFileTree(paths) {
        if (paths.length === 0)
            return '(empty)';
        return paths.sort().map(p => `├── ${p}`).join('\n');
    }
    formatStudentCode(snapshot) {
        const entries = Object.entries(snapshot);
        if (entries.length === 0)
            return 'No files submitted.';
        return entries
            .map(([filePath, content]) => `File: ${filePath}\n\`\`\`\n${content}\n\`\`\``)
            .join('\n\n');
    }
}
//# sourceMappingURL=finish-submission.usecase.js.map