import { PrismaClient } from "@prisma/client";
import { CourseOfferingRepository } from "../domain/courseOffering.repository.js";
import { CourseOfferingEntity } from "../domain/courseOffering.entity.js";
export declare class PrismaCourseOfferingsRepository implements CourseOfferingRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private toEntity;
    create(data: any): Promise<CourseOfferingEntity>;
    update(id: string, data: any): Promise<CourseOfferingEntity | null>;
    findById(id: string): Promise<CourseOfferingEntity | null>;
    findAll(page: number, limit: number, filters?: any): Promise<{
        data: CourseOfferingEntity[];
        total: number;
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=prisma-courseOffering.repository.d.ts.map