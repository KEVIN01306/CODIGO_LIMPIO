import { PrismaClient, Prisma } from "@prisma/client";
import { AssessmentRepository } from "../domain/assessment.repository.js";
import { AssessmentEntity } from "../domain/assessment.entity.js";
import { CreateAssessmentDTO, UpdateAssessmentDTO } from "../domain/assessment.interfaces.js";

export class PrismaAssessmentRepository implements AssessmentRepository {
    constructor(private readonly prisma: PrismaClient) {}

    private toEntity(record: any): AssessmentEntity {
        return new AssessmentEntity(
            record.id,
            record.offeringId,
            record.title,
            record.type,
            Number(record.maxScore),
            record.strictMode,
            record.description,
            record.weight ? Number(record.weight) : undefined,
            record.dueDate,
            record.timeLimitMinutes,
            record.allowedLanguage,
            record.createdAt,
            record.updatedAt,
            record.offering
        );
    }

    async create(data: CreateAssessmentDTO): Promise<AssessmentEntity> {
        const record = await this.prisma.assessment.create({
            data: {
                offeringId: data.offeringId,
                title: data.title,
                description: data.description,
                type: data.type as any,
                maxScore: data.maxScore,
                weight: data.weight,
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
                timeLimitMinutes: data.timeLimitMinutes,
                allowedLanguage: data.allowedLanguage,
                strictMode: data.strictMode ?? true,
            },
            include: { offering: { include: { course: true, cycle: true, campus: true } } }
        });
        return this.toEntity(record);
    }

    async update(id: string, data: UpdateAssessmentDTO): Promise<AssessmentEntity | null> {
        const record = await this.prisma.assessment.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                type: data.type ? (data.type as any) : undefined,
                maxScore: data.maxScore,
                weight: data.weight,
                dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
                timeLimitMinutes: data.timeLimitMinutes,
                allowedLanguage: data.allowedLanguage,
                strictMode: data.strictMode,
            },
            include: { offering: { include: { course: true, cycle: true, campus: true } } }
        });
        return record ? this.toEntity(record) : null;
    }

    async findById(id: string): Promise<AssessmentEntity | null> {
        const record = await this.prisma.assessment.findUnique({
            where: { id },
            include: { offering: { include: { course: true, cycle: true, campus: true } } }
        });
        return record ? this.toEntity(record) : null;
    }

    async findAll(page: number, limit: number, filters?: any): Promise<{ data: AssessmentEntity[], total: number }> {
        const skip = (page - 1) * limit;
        const where: Prisma.AssessmentWhereInput = {};

        if (filters?.offeringId) where.offeringId = filters.offeringId;
        if (filters?.type) where.type = filters.type as any;
        if (filters?.q) {
            where.title = { contains: filters.q };
        }

        const [total, records] = await Promise.all([
            this.prisma.assessment.count({ where }),
            this.prisma.assessment.findMany({
                where,
                skip,
                take: limit,
                include: { offering: { include: { course: true, cycle: true, campus: true } } },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { data: records.map(r => this.toEntity(r)), total };
    }

    async delete(id: string): Promise<void> {
        await this.prisma.assessment.delete({ where: { id } });
    }
}
