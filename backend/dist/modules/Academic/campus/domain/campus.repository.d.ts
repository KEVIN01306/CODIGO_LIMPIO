import type { Campus, CreateCampus, UpdateCampus, GetCampus, GetSimpleCampus } from "./campus.entity.js";
export interface CampusFilters {
    q?: string;
    tenantId: string;
    isActive?: boolean;
}
export interface CampusesRepository {
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
//# sourceMappingURL=campus.repository.d.ts.map