import type { CampusesRepository } from "../domain/campus.repository.js";
import type { GetCampus } from "../domain/campus.entity.js";
export declare class GetCampusUseCase {
    private readonly campusesRepository;
    constructor(campusesRepository: CampusesRepository);
    execute(id: string, tenantId: string): Promise<GetCampus>;
}
//# sourceMappingURL=get-campus.usecase.d.ts.map