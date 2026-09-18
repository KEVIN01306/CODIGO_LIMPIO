import { CourseEnrollmentEntity } from "./courseEnrollment.entity.js";
export interface CourseEnrollmentRepository {
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
//# sourceMappingURL=courseEnrollment.repository.d.ts.map