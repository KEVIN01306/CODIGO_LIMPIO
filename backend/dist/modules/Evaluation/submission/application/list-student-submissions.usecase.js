import { PrismaClient } from '@prisma/client';
import AppError from '../../../../shared/errors/AppError.js';
const prisma = new PrismaClient();
export class ListStudentSubmissionsUseCase {
    submissionRepo;
    constructor(submissionRepo) {
        this.submissionRepo = submissionRepo;
    }
    async execute(userId, offeringId) {
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId }
        });
        if (!studentProfile) {
            throw new AppError('User is not a student', 'FORBIDDEN', 403);
        }
        const whereClause = {
            studentId: studentProfile.id,
        };
        if (offeringId) {
            whereClause.assessment = {
                offeringId
            };
        }
        const records = await prisma.submission.findMany({
            where: whereClause,
            include: {
                assessment: true
            },
            orderBy: {
                startedAt: 'desc'
            }
        });
        return records.map(record => ({
            id: record.id,
            assessmentId: record.assessmentId,
            status: record.status,
            startedAt: record.startedAt,
            submittedAt: record.submittedAt,
            totalScore: record.totalScore !== null && record.totalScore !== undefined ? Number(record.totalScore) : null,
            maxScore: record.assessment?.maxScore ? Number(record.assessment.maxScore) : undefined,
            assessmentTitle: record.assessment?.title,
            feedback: typeof record.aiFeedback === 'string' ? record.aiFeedback : null,
            hasCodeSnapshot: !!record.codeSnapshot && typeof record.codeSnapshot === 'object' && Object.keys(record.codeSnapshot).length > 0
        }));
    }
}
//# sourceMappingURL=list-student-submissions.usecase.js.map