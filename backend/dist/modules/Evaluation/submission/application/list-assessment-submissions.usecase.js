import AppError from '../../../../shared/errors/AppError.js';
export class ListAssessmentSubmissionsUseCase {
    submissionRepository;
    prisma;
    constructor(submissionRepository, prisma) {
        this.submissionRepository = submissionRepository;
        this.prisma = prisma;
    }
    async execute(assessmentId) {
        const assessment = await this.prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                offering: {
                    include: {
                        course: true,
                        cycle: true,
                        campus: true,
                        teacher: { include: { user: true } }
                    }
                }
            }
        });
        if (!assessment) {
            throw new AppError('Assessment not found', 'NOT_FOUND', 404);
        }
        // Get all enrolled students for this course offering
        const enrollments = await this.prisma.courseEnrollment.findMany({
            where: { offeringId: assessment.offeringId },
            include: {
                student: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: [
                { student: { user: { lastName: 'asc' } } },
                { student: { user: { firstName: 'asc' } } }
            ]
        });
        // Get all submissions for this assessment
        const submissions = await this.submissionRepository.findByAssessment(assessmentId);
        const submissionMap = new Map();
        submissions.forEach(sub => {
            submissionMap.set(sub.studentId, sub);
        });
        // Get all grade records for this assessment
        const gradeRecords = await this.prisma.gradeRecord.findMany({
            where: { assessmentId }
        });
        const gradeMap = new Map();
        gradeRecords.forEach(grade => {
            gradeMap.set(grade.enrollmentId, grade);
        });
        // Map students with submission and grading status
        const students = enrollments.map(enrollment => {
            const submission = submissionMap.get(enrollment.studentId) || null;
            const gradeRecord = gradeMap.get(enrollment.id) || null;
            const isSubmitted = submission?.status === 'SUBMITTED' || submission?.status === 'EVALUATED';
            const isInProgress = submission?.status === 'IN_PROGRESS';
            let status = 'NOT_STARTED';
            if (submission) {
                status = submission.status;
            }
            return {
                enrollmentId: enrollment.id,
                studentId: enrollment.studentId,
                studentNumber: enrollment.student.studentNumber,
                firstName: enrollment.student.user.firstName,
                lastName: enrollment.student.user.lastName,
                fullName: `${enrollment.student.user.firstName} ${enrollment.student.user.lastName}`,
                email: enrollment.student.user.email,
                enrollmentStatus: enrollment.status,
                hasSubmitted: isSubmitted,
                submission: submission ? {
                    id: submission.id,
                    status: submission.status,
                    startedAt: submission.startedAt,
                    submittedAt: submission.submittedAt,
                    tabSwitchesCount: submission.tabSwitchesCount ?? 0,
                    clipboardAttempts: submission.clipboardAttempts ?? 0,
                    testsPassedScore: submission.testsPassedScore,
                    aiQualityScore: submission.aiQualityScore,
                    totalScore: submission.totalScore !== null && submission.totalScore !== undefined
                        ? submission.totalScore
                        : (gradeRecord?.score ? Number(gradeRecord.score) : null),
                    feedback: submission.aiFeedback || gradeRecord?.feedback || null,
                    testOutput: submission.testOutput,
                    codeSnapshot: submission.codeSnapshot,
                    filesCount: submission.codeSnapshot && typeof submission.codeSnapshot === 'object'
                        ? Object.keys(submission.codeSnapshot).length
                        : 0
                } : null
            };
        });
        const stats = {
            totalEnrolled: students.length,
            submittedCount: students.filter(s => s.hasSubmitted).length,
            inProgressCount: students.filter(s => s.submission?.status === 'IN_PROGRESS').length,
            notStartedCount: students.filter(s => !s.submission).length,
            gradedCount: students.filter(s => s.submission?.status === 'EVALUATED' || (s.submission && s.submission.totalScore !== null)).length,
            integrityViolationsCount: students.filter(s => (s.submission?.tabSwitchesCount ?? 0) > 0 || (s.submission?.clipboardAttempts ?? 0) > 0).length
        };
        return {
            assessment: {
                id: assessment.id,
                offeringId: assessment.offeringId,
                title: assessment.title,
                description: assessment.description,
                type: assessment.type,
                maxScore: Number(assessment.maxScore),
                weight: assessment.weight ? Number(assessment.weight) : null,
                dueDate: assessment.dueDate,
                strictMode: assessment.strictMode,
                allowedLanguage: assessment.allowedLanguage,
                timeLimitMinutes: assessment.timeLimitMinutes,
                course: {
                    id: assessment.offering.course.id,
                    name: assessment.offering.course.name,
                    code: assessment.offering.course.code,
                },
                offering: {
                    id: assessment.offering.id,
                    section: assessment.offering.section,
                    cycle: assessment.offering.cycle?.name,
                    campus: assessment.offering.campus?.name,
                }
            },
            students,
            stats
        };
    }
}
//# sourceMappingURL=list-assessment-submissions.usecase.js.map