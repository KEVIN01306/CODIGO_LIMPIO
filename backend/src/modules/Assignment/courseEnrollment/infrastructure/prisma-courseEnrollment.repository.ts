import { PrismaClient, Prisma } from "@prisma/client";
import { CourseEnrollmentRepository } from "../domain/courseEnrollment.repository.js";
import { CourseEnrollmentEntity } from "../domain/courseEnrollment.entity.js";

export class PrismaCourseEnrollmentsRepository implements CourseEnrollmentRepository {
    constructor(private readonly prisma: PrismaClient) {}

    private toEntity(record: any): CourseEnrollmentEntity {
        return new CourseEnrollmentEntity(
            record.id,
            record.offeringId,
            record.studentId,
            record.status,
            record.finalGrade,
            record.enrolledAt,
            record.offering,
            record.student
        );
    }

    async create(data: any): Promise<CourseEnrollmentEntity> {
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

    async update(id: string, data: any): Promise<CourseEnrollmentEntity | null> {
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

    async findById(id: string): Promise<CourseEnrollmentEntity | null> {
        const record = await this.prisma.courseEnrollment.findUnique({
            where: { id },
            include: { offering: { include: { course: true, cycle: true, campus: true, teacher: { include: { user: true } } } }, student: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }

    async findByOfferingAndStudent(offeringId: string, studentId: string): Promise<CourseEnrollmentEntity | null> {
        const record = await this.prisma.courseEnrollment.findFirst({
            where: {
                offeringId,
                studentId,
            },
            include: { offering: { include: { course: true, cycle: true, campus: true, teacher: { include: { user: true } } } }, student: { include: { user: true } } }
        });
        return record ? this.toEntity(record) : null;
    }

    async findAll(page: number, limit: number, filters?: any): Promise<{ data: CourseEnrollmentEntity[], total: number }> {
        const skip = (page - 1) * limit;
        const where: Prisma.CourseEnrollmentWhereInput = {};

        if (filters?.offeringId) where.offeringId = filters.offeringId;
        if (filters?.studentId) where.studentId = filters.studentId;
        if (filters?.status) where.status = filters.status;
        if (filters?.userId) where.student = { userId: filters.userId };

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

    async delete(id: string): Promise<void> {
        await this.prisma.courseEnrollment.delete({ where: { id } });
    }
}
