import type { AcademicProgramsRepository } from "../../program/domain/academicProgram.repository.js";
import type { GetAcademicProgram } from "../../program/domain/academicProgram.entity.js";
export declare class GetAcademicProgramUseCase {
    private readonly academicProgramsRepository;
    constructor(academicProgramsRepository: AcademicProgramsRepository);
    execute(id: string, tenantId: string): Promise<GetAcademicProgram>;
}
//# sourceMappingURL=get-academicProgram.usecase.d.ts.map