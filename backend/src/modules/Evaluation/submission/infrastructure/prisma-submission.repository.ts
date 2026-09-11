import { PrismaClient } from '@prisma/client';
import { SubmissionRepository } from '../domain/submission.repository.js';
import { SubmissionEntity } from '../domain/submission.entity.js';

export class PrismaSubmissionRepository implements SubmissionRepository {
    constructor(private readonly prisma: PrismaClient) {}

    private toEntity(record: any): SubmissionEntity {
        return new SubmissionEntity(
            record.id,
            record.assessmentId,
            record.studentId,
            record.status,
            record.startedAt,
            record.submittedAt,
            record.tabSwitchesCount,
            record.clipboardAttempts,
            record.codeSnapshot,
            record.assessment,
            record.student
        );
    }

    async findByAssessmentAndStudent(assessmentId: string, studentId: string): Promise<SubmissionEntity | null> {
        const record = await this.prisma.submission.findFirst({
            where: { assessmentId, studentId },
            include: { assessment: true, student: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }

    async create(data: { assessmentId: string; studentId: string }): Promise<SubmissionEntity> {
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

    async update(id: string, data: any): Promise<SubmissionEntity | null> {
        const record = await this.prisma.submission.update({
            where: { id },
            data,
            include: { assessment: true, student: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }

    async findById(id: string): Promise<SubmissionEntity | null> {
        const record = await this.prisma.submission.findUnique({
            where: { id },
            include: { assessment: true, student: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }
}
