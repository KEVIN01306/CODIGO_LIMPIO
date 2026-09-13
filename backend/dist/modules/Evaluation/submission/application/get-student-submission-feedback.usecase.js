import { PrismaClient } from '@prisma/client';
import AppError from '../../../../shared/errors/AppError.js';
const prisma = new PrismaClient();
export class GetStudentSubmissionFeedbackUseCase {
    submissionRepo;
    constructor(submissionRepo) {
        this.submissionRepo = submissionRepo;
    }
    /**
     * Helper to parse evaluation findings/mistakes from testOutput or aiFeedback.
     */
    extractFindings(aiFeedback, testOutput) {
        const findings = [];
        // 1. Check if aiFeedback has structured findings or mistakes
        if (aiFeedback && typeof aiFeedback === 'object') {
            if (Array.isArray(aiFeedback.findings)) {
                for (const item of aiFeedback.findings) {
                    if (typeof item === 'string') {
                        findings.push({ title: item, description: item });
                    }
                    else if (item && typeof item === 'object') {
                        findings.push({
                            title: item.title || item.name || 'Evaluation Finding',
                            description: item.description || item.message || item.detail || '',
                            severity: item.severity || item.type
                        });
                    }
                }
            }
            else if (Array.isArray(aiFeedback.mistakes)) {
                for (const item of aiFeedback.mistakes) {
                    if (typeof item === 'string') {
                        findings.push({ title: item, description: item });
                    }
                    else if (item && typeof item === 'object') {
                        findings.push({
                            title: item.title || item.name || 'Mistake Detected',
                            description: item.description || item.message || '',
                            severity: item.severity
                        });
                    }
                }
            }
        }
        // 2. Check if testOutput has test failures/findings
        if (testOutput && typeof testOutput === 'object') {
            if (Array.isArray(testOutput.failures)) {
                for (const f of testOutput.failures) {
                    findings.push({
                        title: f.title || f.name || f.test || 'Failed Test Case',
                        description: f.message || f.error || (f.expected ? `Expected: ${f.expected}, Received: ${f.actual || f.received}` : String(f)),
                        severity: 'error'
                    });
                }
            }
            else if (Array.isArray(testOutput.errors)) {
                for (const err of testOutput.errors) {
                    findings.push({
                        title: err.title || 'Execution Error',
                        description: typeof err === 'string' ? err : (err.message || JSON.stringify(err)),
                        severity: 'error'
                    });
                }
            }
            else if (Array.isArray(testOutput.testResults)) {
                for (const suite of testOutput.testResults) {
                    if (Array.isArray(suite.assertionResults)) {
                        for (const assert of suite.assertionResults) {
                            if (assert.status === 'failed') {
                                findings.push({
                                    title: assert.title || assert.fullName || 'Assertion Failed',
                                    description: Array.isArray(assert.failureMessages) ? assert.failureMessages.join('\n') : (assert.failureMessages || 'Test condition not met'),
                                    severity: 'error'
                                });
                            }
                        }
                    }
                }
            }
        }
        return findings;
    }
    /**
     * Helper to extract teacher comments from aiFeedback or gradeRecord.
     */
    extractTeacherComments(aiFeedback) {
        if (!aiFeedback)
            return null;
        if (typeof aiFeedback === 'string')
            return aiFeedback.trim();
        if (typeof aiFeedback === 'object') {
            if (typeof aiFeedback.comments === 'string')
                return aiFeedback.comments.trim();
            if (typeof aiFeedback.feedback === 'string')
                return aiFeedback.feedback.trim();
            if (typeof aiFeedback.teacherComments === 'string')
                return aiFeedback.teacherComments.trim();
        }
        return null;
    }
    formatResponse(submission, gradeRecordFeedback) {
        const assessment = submission.assessment || {};
        const isEvaluated = submission.status === 'EVALUATED';
        let teacherComments = null;
        let findings = [];
        let score = null;
        if (isEvaluated) {
            score = submission.totalScore !== null && submission.totalScore !== undefined
                ? Number(submission.totalScore)
                : null;
            teacherComments = this.extractTeacherComments(submission.aiFeedback) || gradeRecordFeedback || null;
            findings = this.extractFindings(submission.aiFeedback, submission.testOutput);
        }
        return {
            submissionId: submission.id,
            assessmentId: submission.assessmentId,
            assessmentTitle: assessment.title || 'Assessment',
            assessmentDescription: assessment.description || null,
            allowedLanguage: assessment.allowedLanguage || 'javascript',
            maxScore: assessment.maxScore ? Number(assessment.maxScore) : 100,
            weight: assessment.weight ? Number(assessment.weight) : null,
            status: submission.status,
            startedAt: submission.startedAt,
            submittedAt: submission.submittedAt,
            // Code snapshot is the evaluated/submitted snapshot
            submittedCode: submission.codeSnapshot || null,
            score,
            teacherComments,
            evaluationFindings: findings,
            testsPassedScore: isEvaluated ? (submission.testsPassedScore ? Number(submission.testsPassedScore) : null) : null,
            aiQualityScore: isEvaluated ? (submission.aiQualityScore ? Number(submission.aiQualityScore) : null) : null,
            testOutput: isEvaluated ? (submission.testOutput || null) : null,
        };
    }
    /**
     * Retrieve feedback by submission ID, strictly verifying student ownership.
     */
    async execute(submissionId, userId) {
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId }
        });
        if (!studentProfile) {
            throw new AppError('User is not a student', 'FORBIDDEN', 403);
        }
        const submission = await this.submissionRepo.findById(submissionId);
        if (!submission) {
            throw new AppError('Submission not found', 'NOT_FOUND', 404);
        }
        // Ownership enforcement: Submission MUST belong to the authenticated student
        if (submission.studentId !== studentProfile.id) {
            throw new AppError('You are not authorized to view this submission feedback', 'FORBIDDEN', 403);
        }
        // Check if there is a gradeRecord with feedback
        let gradeRecordFeedback = null;
        try {
            const enrollment = await prisma.courseEnrollment.findFirst({
                where: {
                    offeringId: submission.assessment?.offeringId,
                    studentId: studentProfile.id
                }
            });
            if (enrollment) {
                const gradeRecord = await prisma.gradeRecord.findUnique({
                    where: {
                        enrollmentId_assessmentId: {
                            enrollmentId: enrollment.id,
                            assessmentId: submission.assessmentId
                        }
                    }
                });
                if (gradeRecord?.feedback) {
                    gradeRecordFeedback = gradeRecord.feedback;
                }
            }
        }
        catch {
            // Ignore gradeRecord lookup error
        }
        return this.formatResponse(submission, gradeRecordFeedback);
    }
    /**
     * Retrieve feedback by assessment ID for the authenticated student.
     */
    async executeByAssessment(assessmentId, userId) {
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId }
        });
        if (!studentProfile) {
            throw new AppError('User is not a student', 'FORBIDDEN', 403);
        }
        const submission = await this.submissionRepo.findByAssessmentAndStudent(assessmentId, studentProfile.id);
        if (!submission) {
            throw new AppError('No submission found for this assessment', 'NOT_FOUND', 404);
        }
        return this.execute(submission.id, userId);
    }
}
//# sourceMappingURL=get-student-submission-feedback.usecase.js.map