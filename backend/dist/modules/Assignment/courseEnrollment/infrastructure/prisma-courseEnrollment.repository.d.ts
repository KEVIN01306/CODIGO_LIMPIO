import { PrismaClient } from "@prisma/client";
import { CourseEnrollmentRepository } from "../domain/courseEnrollment.repository.js";
import { CourseEnrollmentEntity } from "../domain/courseEnrollment.entity.js";
export declare class PrismaCourseEnrollmentsRepository implements CourseEnrollmentRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private toEntity;
    create(data: any): Promise<CourseEnrollmentEntity>;
    update(id: string, data: any): Promise<CourseEnrollmentEntity | null>;
    findById(id: string): Promise<CourseEnrollmentEntity | null>;
    findByOfferingAndStudent(offeringId: string, studentId: string): Promise<CourseEnrollmentEntity | null>;
    findAll(page: number, limit: number, filters?: any): Promise<{
        data: CourseEnrollmentEntity[];
        total: number;
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=prisma-courseEnrollment.repository.d.ts.map