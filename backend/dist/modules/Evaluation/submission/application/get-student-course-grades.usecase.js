import { PrismaClient } from '@prisma/client';
import AppError from '../../../../shared/errors/AppError.js';
const prisma = new PrismaClient();
export class GetStudentCourseGradesUseCase {
    submissionRepo;
    constructor(submissionRepo) {
        this.submissionRepo = submissionRepo;
    }
    extractFindings(aiFeedback, testOutput) {
        const findings = [];
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
    extractAiFeedback(aiFeedback) {
        if (!aiFeedback)
            return null;
        if (typeof aiFeedback === 'string')
            return aiFeedback.trim() || null;
        if (typeof aiFeedback === 'object') {
            if (typeof aiFeedback.aiFeedback === 'string' && aiFeedback.aiFeedback.trim())
                return aiFeedback.aiFeedback.trim();
            if (typeof aiFeedback.feedback === 'string' && aiFeedback.feedback.trim())
                return aiFeedback.feedback.trim();
            if (typeof aiFeedback.comments === 'string' && aiFeedback.comments.trim())
                return aiFeedback.comments.trim();
            if (typeof aiFeedback.teacherComments === 'string' && aiFeedback.teacherComments.trim())
                return aiFeedback.teacherComments.trim();
        }
        return null;
    }
    async execute(userId, offeringId) {
        // 1. Verify student profile
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId }
        });
        if (!studentProfile) {
            throw new AppError('User is not a student', 'FORBIDDEN', 403);
        }
        // 2. Verify student is enrolled in the course offering
        const enrollment = await prisma.courseEnrollment.findFirst({
            where: {
                studentId: studentProfile.id,
                offeringId: offeringId
            },
            include: {
                offering: {
                    include: {
                        course: true
                    }
                }
            }
        });
        if (!enrollment || !enrollment.offering) {
            throw new AppError('You are not enrolled in this course', 'FORBIDDEN', 403);
        }
        const offering = enrollment.offering;
        // 3. Fetch all assessments for this offering
        const assessments = await prisma.assessment.findMany({
            where: { offeringId },
            orderBy: [
                { dueDate: 'asc' },
                { createdAt: 'asc' }
            ]
        });
        // 4. Fetch all submissions of the student for this offering
        const submissions = await prisma.submission.findMany({
            where: {
                studentId: studentProfile.id,
                assessment: {
                    offeringId
                }
            }
        });
        // 5. Fetch all grade records for this enrollment
        const gradeRecords = await prisma.gradeRecord.findMany({
            where: {
                enrollmentId: enrollment.id
            }
        });
        const submissionMap = new Map();
        for (const sub of submissions) {
            submissionMap.set(sub.assessmentId, sub);
        }
        const gradeRecordMap = new Map();
        for (const gr of gradeRecords) {
            gradeRecordMap.set(gr.assessmentId, gr);
        }
        // 6. Map each assessment into authoritative grade item DTO
        let totalPointsEarned = 0;
        let totalPossiblePoints = 0;
        let evaluatedAssessmentsCount = 0;
        const grades = assessments.map((assessment) => {
            const maxScore = assessment.maxScore ? Number(assessment.maxScore) : 0;
            const assessmentValue = assessment.weight !== null && assessment.weight !== undefined && Number(assessment.weight) > 0
                ? Number(assessment.weight)
                : maxScore;
            totalPossiblePoints += assessmentValue;
            const submission = submissionMap.get(assessment.id);
            const gradeRecord = gradeRecordMap.get(assessment.id);
            let submissionStatus = 'NOT_STARTED';
            let score = null;
            let equivalentPoints = null;
            let percentage = null;
            let aiFeedback = null;
            let evaluationFindings = [];
            if (submission) {
                submissionStatus = submission.status;
                const isEvaluated = submission.status === 'EVALUATED' || !!gradeRecord;
                if (isEvaluated) {
                    submissionStatus = 'EVALUATED';
                    if (submission.totalScore !== null && submission.totalScore !== undefined) {
                        score = Number(submission.totalScore);
                    }
                    else if (gradeRecord?.score !== null && gradeRecord?.score !== undefined) {
                        score = Number(gradeRecord.score);
                    }
                    if (score !== null && maxScore > 0) {
                        equivalentPoints = Number(((score / maxScore) * assessmentValue).toFixed(2));
                        percentage = Number(((score / maxScore) * 100).toFixed(2));
                        totalPointsEarned += equivalentPoints;
                        evaluatedAssessmentsCount += 1;
                    }
                    aiFeedback = this.extractAiFeedback(submission.aiFeedback) || (gradeRecord?.feedback ? gradeRecord.feedback.trim() : null);
                    evaluationFindings = this.extractFindings(submission.aiFeedback, submission.testOutput);
                }
            }
            return {
                assessmentId: assessment.id,
                title: assessment.title,
                description: assessment.description,
                type: assessment.type,
                maxScore,
                assessmentValue,
                submissionId: submission ? submission.id : null,
                submissionStatus,
                score,
                equivalentPoints,
                percentage,
                aiFeedback,
                evaluationFindings,
                dueDate: assessment.dueDate
            };
        });
        const overallPercentage = totalPossiblePoints > 0
            ? Number(((totalPointsEarned / totalPossiblePoints) * 100).toFixed(2))
            : null;
        return {
            course: {
                id: offering.course?.id || '',
                name: offering.course?.name || 'Course',
                code: offering.course?.code || 'N/A',
                section: offering.section,
                offeringId: offering.id
            },
            grades,
            summary: {
                totalPointsEarned: Number(totalPointsEarned.toFixed(2)),
                totalPossiblePoints: Number(totalPossiblePoints.toFixed(2)),
                overallPercentage,
                evaluatedAssessmentsCount,
                totalAssessmentsCount: assessments.length
            }
        };
    }
}
//# sourceMappingURL=get-student-course-grades.usecase.js.map