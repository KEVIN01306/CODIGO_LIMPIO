import { PrismaClient, Prisma } from "@prisma/client";
import { AssessmentRepository } from "../domain/assessment.repository.js";
import { AssessmentEntity } from "../domain/assessment.entity.js";
import { CreateAssessmentDTO, UpdateAssessmentDTO } from "../domain/assessment.interfaces.js";

export class PrismaAssessmentRepository implements AssessmentRepository {
    constructor(private readonly prisma: PrismaClient) { }

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
            record.offering,
            record.requireSeb ?? false,
            record.sebConfigKey,
            record.sebConfigFilePath
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
                strictMode: data.strictMode ?? false,
                requireSeb: data.requireSeb ?? false,
                sebConfigKey: data.sebConfigKey,
                sebConfigFilePath: data.sebConfigFilePath,
            },
            include: { offering: { include: { course: true, cycle: true, campus: true } } }
        });
        return this.toEntity(record);
    }

    async update(id: string, data: UpdateAssessmentDTO): Promise<AssessmentEntity | null> {
        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.type !== undefined) updateData.type = data.type as any;
        if (data.maxScore !== undefined) updateData.maxScore = data.maxScore;
        if (data.weight !== undefined) updateData.weight = data.weight;
        if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
        if (data.timeLimitMinutes !== undefined) updateData.timeLimitMinutes = data.timeLimitMinutes;
        if (data.allowedLanguage !== undefined) updateData.allowedLanguage = data.allowedLanguage;
        if (data.strictMode !== undefined) updateData.strictMode = data.strictMode;
        if (data.requireSeb !== undefined) updateData.requireSeb = data.requireSeb;
        if (data.sebConfigKey !== undefined) updateData.sebConfigKey = data.sebConfigKey;
        if (data.sebConfigFilePath !== undefined) updateData.sebConfigFilePath = data.sebConfigFilePath;

        const record = await this.prisma.assessment.update({
            where: { id },
            data: updateData,
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

    async getOfferingTenantId(offeringId: string): Promise<string | null> {
        const offering = await this.prisma.courseOffering.findUnique({
            where: { id: offeringId },
            include: { campus: true }
        });
        return offering?.campus?.tenantId ?? null;
    }
}
