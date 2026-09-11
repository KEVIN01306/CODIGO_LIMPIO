import type { GetSimpleAcademicProgram } from "../../program/domain/academicProgram.entity.js";
export interface Course {
    id: string;
    tenantId: string;
    programId: string | null;
    code: string;
    name: string;
    description: string | null;
    credits: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateCourse extends Omit<Course, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {
}
export interface UpdateCourse extends Partial<Omit<Course, 'id' | 'createdAt' | 'updatedAt'>> {
}
export interface GetCourse extends Course {
    program?: GetSimpleAcademicProgram;
}
export interface GetSimpleCourse extends Pick<Course, 'id' | 'code' | 'name' | 'credits' | 'programId' | 'isActive' | 'createdAt'> {
    program?: GetSimpleAcademicProgram;
}
//# sourceMappingURL=course.entity.d.ts.map