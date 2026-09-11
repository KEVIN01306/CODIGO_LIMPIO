import { CourseOfferingEntity } from "../domain/courseOffering.entity.js";
export class PrismaCourseOfferingsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toEntity(record) {
        return new CourseOfferingEntity(record.id, record.campusId, record.courseId, record.cycleId, record.teacherId, record.section, record.campus, record.course, record.cycle, record.teacher);
    }
    async create(data) {
        const record = await this.prisma.courseOffering.create({
            data: {
                campusId: data.campusId,
                courseId: data.courseId,
                cycleId: data.cycleId,
                teacherId: data.teacherId || null,
                section: data.section
            },
            include: { campus: true, course: true, cycle: true, teacher: { include: { user: true } } }
        });
        return this.toEntity(record);
    }
    async update(id, data) {
        const record = await this.prisma.courseOffering.update({
            where: { id },
            data: {
                campusId: data.campusId,
                courseId: data.courseId,
                cycleId: data.cycleId,
                teacherId: data.teacherId || null,
                section: data.section
            },
            include: { campus: true, course: true, cycle: true, teacher: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }
    async findById(id) {
        const record = await this.prisma.courseOffering.findUnique({
            where: { id },
            include: { campus: true, course: true, cycle: true, teacher: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }
    async findAll(page, limit, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.campusId)
            where.campusId = filters.campusId;
        if (filters?.courseId)
            where.courseId = filters.courseId;
        if (filters?.cycleId)
            where.cycleId = filters.cycleId;
        if (filters?.teacherId)
            where.teacherId = filters.teacherId;
        if (filters?.userId)
            where.teacher = { userId: filters.userId };
        const [total, records] = await Promise.all([
            this.prisma.courseOffering.count({ where }),
            this.prisma.courseOffering.findMany({
                where,
                skip,
                take: limit,
                include: { campus: true, course: true, cycle: true, teacher: { include: { user: true } } },
                orderBy: { createdAt: 'desc' }
            })
        ]);
        return { data: records.map(r => this.toEntity(r)), total };
    }
    async delete(id) {
        await this.prisma.courseOffering.delete({ where: { id } });
    }
}
//# sourceMappingURL=prisma-courseOffering.repository.js.map