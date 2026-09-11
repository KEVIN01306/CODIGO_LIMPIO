import type { AcademicProgram, CreateAcademicProgram, UpdateAcademicProgram, GetAcademicProgram, GetSimpleAcademicProgram } from "./academicProgram.entity.js";

export interface AcademicProgramFilters {
    q?: string;
    tenantId: string;
}

export interface AcademicProgramsRepository {
    create(data: CreateAcademicProgram): Promise<GetAcademicProgram>;
    update(id: string, data: UpdateAcademicProgram): Promise<GetAcademicProgram>;
    findById(id: string): Promise<GetAcademicProgram | null>;
    findByCode(tenantId: string, code: string): Promise<AcademicProgram | null>;
    findAll(page: number, perPage: number, filters: AcademicProgramFilters): Promise<{ total: number, data: GetSimpleAcademicProgram[] }>;
    delete(id: string): Promise<void>;
}
