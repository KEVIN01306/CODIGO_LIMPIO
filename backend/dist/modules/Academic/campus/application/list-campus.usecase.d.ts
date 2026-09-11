import type { CampusesRepository, CampusFilters } from "../../campus/domain/campus.repository.js";
import type { GetSimpleCampus } from "../../campus/domain/campus.entity.js";
export declare class ListCampusesUseCase {
    private readonly campusesRepository;
    constructor(campusesRepository: CampusesRepository);
    execute(page: number, perPage: number, filters: CampusFilters): Promise<{
        total: number;
        data: GetSimpleCampus[];
    }>;
}
//# sourceMappingURL=list-campus.usecase.d.ts.map