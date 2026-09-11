import type { AcademicCycle, CreateAcademicCycle, UpdateAcademicCycle, GetAcademicCycle, GetSimpleAcademicCycle } from "./academicCycle.entity.js";

export interface AcademicCycleFilters {
    q?: string;
    campusId?: string;
    tenantId?: string;
}

export interface AcademicCyclesRepository {
    create(data: CreateAcademicCycle): Promise<GetAcademicCycle>;
    update(id: string, data: UpdateAcademicCycle): Promise<GetAcademicCycle>;
    findById(id: string): Promise<GetAcademicCycle | null>;
    findAll(page: number, perPage: number, filters: AcademicCycleFilters): Promise<{ total: number, data: GetSimpleAcademicCycle[] }>;
    delete(id: string): Promise<void>;
}
