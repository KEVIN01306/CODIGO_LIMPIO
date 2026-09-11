import { CourseEnrollmentEntity } from "../domain/courseEnrollment.entity.js";
export class PrismaCourseEnrollmentsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toEntity(record) {
        return new CourseEnrollmentEntity(record.id, record.offeringId, record.studentId, record.status, record.finalGrade, record.enrolledAt, record.offering, record.student);
    }
    async create(data) {
        const record = await this.prisma.courseEnrollment.create({
            data: {
                offeringId: data.offeringId,
                studentId: data.studentId,
                status: data.status || 'ENROLLED',
                finalGrade: data.finalGrade || null
            },
            include: { offering: { include: { course: true, cycle: true, campus: true } }, student: { include: { user: true } } }
        });
        return this.toEntity(record);
    }
    async update(id, data) {
        const record = await this.prisma.courseEnrollment.update({
            where: { id },
            data: {
                status: data.status,
                finalGrade: data.finalGrade !== undefined ? data.finalGrade : undefined
            },
            include: { offering: { include: { course: true, cycle: true, campus: true } }, student: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }
    async findById(id) {
        const record = await this.prisma.courseEnrollment.findUnique({
            where: { id },
            include: { offering: { include: { course: true, cycle: true, campus: true, teacher: { include: { user: true } } } }, student: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }
    async findAll(page, limit, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.offeringId)
            where.offeringId = filters.offeringId;
        if (filters?.studentId)
            where.studentId = filters.studentId;
        if (filters?.status)
            where.status = filters.status;
        if (filters?.userId)
            where.student = { userId: filters.userId };
        const [total, records] = await Promise.all([
            this.prisma.courseEnrollment.count({ where }),
            this.prisma.courseEnrollment.findMany({
                where,
                skip,
                take: limit,
                include: { offering: { include: { course: true, cycle: true, campus: true } }, student: { include: { user: true } } },
                orderBy: { enrolledAt: 'desc' }
            })
        ]);
        return { data: records.map(r => this.toEntity(r)), total };
    }
    async delete(id) {
        await this.prisma.courseEnrollment.delete({ where: { id } });
    }
}
//# sourceMappingURL=prisma-courseEnrollment.repository.js.map