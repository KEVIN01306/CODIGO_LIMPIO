import type { AcademicCyclesRepository, AcademicCycleFilters } from "../../cycle/domain/academicCycle.repository.js";
import type { GetSimpleAcademicCycle } from "../../cycle/domain/academicCycle.entity.js";
export declare class ListAcademicCyclesUseCase {
    private readonly academicCyclesRepository;
    constructor(academicCyclesRepository: AcademicCyclesRepository);
    execute(page: number, perPage: number, filters: AcademicCycleFilters): Promise<{
        total: number;
        data: GetSimpleAcademicCycle[];
    }>;
}
//# sourceMappingURL=list-academicCycle.usecase.d.ts.map