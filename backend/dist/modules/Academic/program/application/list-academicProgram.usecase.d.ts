import type { AcademicProgramsRepository, AcademicProgramFilters } from "../../program/domain/academicProgram.repository.js";
import type { GetSimpleAcademicProgram } from "../../program/domain/academicProgram.entity.js";
export declare class ListAcademicProgramsUseCase {
    private readonly academicProgramsRepository;
    constructor(academicProgramsRepository: AcademicProgramsRepository);
    execute(page: number, perPage: number, filters: AcademicProgramFilters): Promise<{
        total: number;
        data: GetSimpleAcademicProgram[];
    }>;
}
//# sourceMappingURL=list-academicProgram.usecase.d.ts.map