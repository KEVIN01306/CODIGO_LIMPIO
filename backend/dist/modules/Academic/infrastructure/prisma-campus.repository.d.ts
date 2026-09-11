import type { PrismaClient } from "@prisma/client";
import type { CampusesRepository, CampusFilters } from "../domain/campus.repository.js";
import type { Campus, CreateCampus, UpdateCampus, GetCampus, GetSimpleCampus } from "../domain/campus.entity.js";
export declare class PrismaCampusesRepository implements CampusesRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(data: CreateCampus): Promise<GetCampus>;
    update(id: string, data: UpdateCampus): Promise<GetCampus>;
    findById(id: string): Promise<GetCampus | null>;
    findByCode(tenantId: string, code: string): Promise<Campus | null>;
    findAll(page: number, perPage: number, filters: CampusFilters): Promise<{
        total: number;
        data: GetSimpleCampus[];
    }>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=prisma-campus.repository.d.ts.map