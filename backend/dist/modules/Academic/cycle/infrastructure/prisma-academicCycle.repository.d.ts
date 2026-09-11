import type { PrismaClient } from "@prisma/client";
import type { AcademicCyclesRepository, AcademicCycleFilters } from "../../cycle/domain/academicCycle.repository.js";
import type { CreateAcademicCycle, UpdateAcademicCycle, GetAcademicCycle, GetSimpleAcademicCycle } from "../../cycle/domain/academicCycle.entity.js";
export declare class PrismaAcademicCyclesRepository implements AcademicCyclesRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(data: CreateAcademicCycle): Promise<GetAcademicCycle>;
    update(id: string, data: UpdateAcademicCycle): Promise<GetAcademicCycle>;
    findById(id: string): Promise<GetAcademicCycle | null>;
    findAll(page: number, perPage: number, filters: AcademicCycleFilters): Promise<{
        total: number;
        data: GetSimpleAcademicCycle[];
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=prisma-academicCycle.repository.d.ts.map