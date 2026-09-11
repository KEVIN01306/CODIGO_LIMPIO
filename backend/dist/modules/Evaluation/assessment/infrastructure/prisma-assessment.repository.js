import { AssessmentEntity } from "../domain/assessment.entity.js";
export class PrismaAssessmentRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toEntity(record) {
        return new AssessmentEntity(record.id, record.offeringId, record.title, record.type, Number(record.maxScore), record.strictMode, record.description, record.weight ? Number(record.weight) : undefined, record.dueDate, record.timeLimitMinutes, record.allowedLanguage, record.createdAt, record.updatedAt, record.offering);
    }
    async create(data) {
        const record = await this.prisma.assessment.create({
            data: {
                offeringId: data.offeringId,
                title: data.title,
                description: data.description,
                type: data.type,
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
    async update(id, data) {
        const record = await this.prisma.assessment.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                type: data.type ? data.type : undefined,
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
    async findById(id) {
        const record = await this.prisma.assessment.findUnique({
            where: { id },
            include: { offering: { include: { course: true, cycle: true, campus: true } } }
        });
        return record ? this.toEntity(record) : null;
    }
    async findAll(page, limit, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.offeringId)
            where.offeringId = filters.offeringId;
        if (filters?.type)
            where.type = filters.type;
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
    async delete(id) {
        await this.prisma.assessment.delete({ where: { id } });
    }
}
//# sourceMappingURL=prisma-assessment.repository.js.map