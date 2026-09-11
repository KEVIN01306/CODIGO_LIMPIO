import { SubmissionEntity } from '../domain/submission.entity.js';
export class PrismaSubmissionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toEntity(record) {
        return new SubmissionEntity(record.id, record.assessmentId, record.studentId, record.status, record.startedAt, record.submittedAt, record.tabSwitchesCount, record.clipboardAttempts, record.codeSnapshot, record.assessment, record.student);
    }
    async findByAssessmentAndStudent(assessmentId, studentId) {
        const record = await this.prisma.submission.findFirst({
            where: { assessmentId, studentId },
            include: { assessment: true, student: { include: { user: true } } }
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
}
//# sourceMappingURL=prisma-submission.repository.js.map