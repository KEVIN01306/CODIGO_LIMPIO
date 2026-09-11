import { PrismaClient, Prisma } from "@prisma/client";
import { CourseOfferingRepository } from "../domain/courseOffering.repository.js";
import { CourseOfferingEntity } from "../domain/courseOffering.entity.js";

export class PrismaCourseOfferingsRepository implements CourseOfferingRepository {
    constructor(private readonly prisma: PrismaClient) {}

    private toEntity(record: any): CourseOfferingEntity {
        return new CourseOfferingEntity(
            record.id,
            record.campusId,
            record.courseId,
            record.cycleId,
            record.teacherId,
            record.section,
            record.campus,
            record.course,
            record.cycle,
            record.teacher
        );
    }

    async create(data: any): Promise<CourseOfferingEntity> {
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

    async update(id: string, data: any): Promise<CourseOfferingEntity | null> {
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

    async findById(id: string): Promise<CourseOfferingEntity | null> {
        const record = await this.prisma.courseOffering.findUnique({
            where: { id },
            include: { campus: true, course: true, cycle: true, teacher: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }

    async findAll(page: number, limit: number, filters?: any): Promise<{ data: CourseOfferingEntity[], total: number }> {
        const skip = (page - 1) * limit;
        const where: Prisma.CourseOfferingWhereInput = {};

        if (filters?.campusId) where.campusId = filters.campusId;
        if (filters?.courseId) where.courseId = filters.courseId;
        if (filters?.cycleId) where.cycleId = filters.cycleId;
        if (filters?.teacherId) where.teacherId = filters.teacherId;
        if (filters?.userId) where.teacher = { userId: filters.userId };

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

    async delete(id: string): Promise<void> {
        await this.prisma.courseOffering.delete({ where: { id } });
    }
}
