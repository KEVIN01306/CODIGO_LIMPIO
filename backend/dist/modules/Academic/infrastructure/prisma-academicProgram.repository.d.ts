import type { PrismaClient } from "@prisma/client";
import type { AcademicProgramsRepository, AcademicProgramFilters } from "../domain/academicProgram.repository.js";
import type { AcademicProgram, CreateAcademicProgram, UpdateAcademicProgram, GetAcademicProgram, GetSimpleAcademicProgram } from "../domain/academicProgram.entity.js";
export declare class PrismaAcademicProgramsRepository implements AcademicProgramsRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(data: CreateAcademicProgram): Promise<GetAcademicProgram>;
    update(id: string, data: UpdateAcademicProgram): Promise<GetAcademicProgram>;
    findById(id: string): Promise<GetAcademicProgram | null>;
    findByCode(tenantId: string, code: string): Promise<AcademicProgram | null>;
    findAll(page: number, perPage: number, filters: AcademicProgramFilters): Promise<{
        total: number;
        data: GetSimpleAcademicProgram[];
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=prisma-academicProgram.repository.d.ts.map