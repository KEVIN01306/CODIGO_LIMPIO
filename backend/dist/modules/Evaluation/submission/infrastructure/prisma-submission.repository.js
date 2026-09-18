import { SubmissionEntity } from '../domain/submission.entity.js';
export class PrismaSubmissionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toEntity(record) {
        return new SubmissionEntity(record.id, record.assessmentId, record.studentId, record.status, record.startedAt, record.submittedAt, record.tabSwitchesCount, record.clipboardAttempts, record.codeSnapshot, record.assessment, record.student, record.testsPassedScore !== null && record.testsPassedScore !== undefined ? Number(record.testsPassedScore) : null, record.aiQualityScore !== null && record.aiQualityScore !== undefined ? Number(record.aiQualityScore) : null, record.totalScore !== null && record.totalScore !== undefined ? Number(record.totalScore) : null, record.testOutput, record.aiFeedback, record.chatHistory);
    }
    async findByAssessmentAndStudent(assessmentId, studentId) {
        const record = await this.prisma.submission.findFirst({
            where: { assessmentId, studentId },
            include: { assessment: true, student: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }
    async findActiveByStudent(studentId) {
        const record = await this.prisma.submission.findFirst({
            where: { studentId, status: 'IN_PROGRESS' },
            include: { assessment: true, student: { include: { user: true } } },
            orderBy: { submittedAt: 'desc' }
        });
        return record ? this.toEntity(record) : null;
    }
    async create(data) {
        const record = await this.prisma.submission.create({
            data: {
                assessmentId: data.assessmentId,
                studentId: data.studentId,
                status: 'IN_PROGRESS'
            },
            include: { assessment: true, student: { include: { user: true } } }
        });
        return this.toEntity(record);
    }
    async update(id, data) {
        const record = await this.prisma.submission.update({
            where: { id },
            data,
            include: { assessment: true, student: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }
    async findById(id) {
        const record = await this.prisma.submission.findUnique({
            where: { id },
            include: { assessment: true, student: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }
    async findByAssessment(assessmentId) {
        const records = await this.prisma.submission.findMany({
            where: { assessmentId },
            include: { assessment: true, student: { include: { user: true } } },
            orderBy: { startedAt: 'asc' }
        });
        return records.map(r => this.toEntity(r));
    }
    async updateGrade(id, totalScore, feedback) {
        const updateData = {
            totalScore,
            status: 'EVALUATED'
        };
        if (feedback !== undefined) {
            updateData.aiFeedback = feedback;
        }
        const record = await this.prisma.submission.update({
            where: { id },
            data: updateData,
            include: { assessment: true, student: { include: { user: true } } }
        });
        // Also sync GradeRecord if exists or create it
        if (record) {
            try {
                // Find enrollment
                const enrollment = await this.prisma.courseEnrollment.findFirst({
                    where: {
                        offeringId: record.assessment.offeringId,
                        studentId: record.studentId
                    }
                });
                if (enrollment) {
                    await this.prisma.gradeRecord.upsert({
                        where: {
                            enrollmentId_assessmentId: {
                                enrollmentId: enrollment.id,
                                assessmentId: record.assessmentId
                            }
                        },
                        create: {
                            enrollmentId: enrollment.id,
                            assessmentId: record.assessmentId,
                            score: totalScore,
                            feedback: feedback || null,
                            isOverridden: true
                        },
                        update: {
                            score: totalScore,
                            feedback: feedback !== undefined ? feedback : undefined,
                            isOverridden: true
                        }
                    });
                }
            }
            catch (err) {
                console.error('Error syncing GradeRecord:', err);
            }
        }
        return record ? this.toEntity(record) : null;
    }
}
//# sourceMappingURL=prisma-submission.repository.js.map