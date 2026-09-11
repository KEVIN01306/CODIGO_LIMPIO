import { CourseOfferingEntity } from "./courseOffering.entity.js";
export interface CourseOfferingRepository {
    create(data: any): Promise<CourseOfferingEntity>;
    update(id: string, data: any): Promise<CourseOfferingEntity | null>;
    findById(id: string): Promise<CourseOfferingEntity | null>;
    findAll(page: number, limit: number, filters?: any): Promise<{
        data: CourseOfferingEntity[];
        total: number;
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=courseOffering.repository.d.ts.map