import type { AcademicCyclesRepository } from "../../cycle/domain/academicCycle.repository.js";
import type { GetAcademicCycle } from "../../cycle/domain/academicCycle.entity.js";
export declare class GetAcademicCycleUseCase {
    private readonly academicCyclesRepository;
    constructor(academicCyclesRepository: AcademicCyclesRepository);
    execute(id: string, tenantId: string): Promise<GetAcademicCycle>;
}
//# sourceMappingURL=get-academicCycle.usecase.d.ts.map