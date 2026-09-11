import type { GetSimpleCampus } from "../../campus/domain/campus.entity.js";
export interface AcademicCycle {
    id: string;
    campusId: string;
    name: string;
    year: number;
    order: number;
    startDate: Date;
    endDate: Date;
    isCurrent: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateAcademicCycle extends Omit<AcademicCycle, 'id' | 'createdAt' | 'updatedAt' | 'isCurrent'> {
    isCurrent?: boolean;
}
export interface UpdateAcademicCycle extends Partial<Omit<AcademicCycle, 'id' | 'createdAt' | 'updatedAt'>> {
}
export interface GetAcademicCycle extends AcademicCycle {
    campus?: GetSimpleCampus;
}
export interface GetSimpleAcademicCycle extends Pick<AcademicCycle, 'id' | 'name' | 'startDate' | 'endDate' | 'campusId' | 'createdAt' | 'year' | 'order' | 'isCurrent'> {
    campus?: GetSimpleCampus;
}
//# sourceMappingURL=academicCycle.entity.d.ts.map