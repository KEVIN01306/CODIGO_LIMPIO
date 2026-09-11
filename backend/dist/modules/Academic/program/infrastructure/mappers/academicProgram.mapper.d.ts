import type { AcademicProgram as PrismaAcademicProgram } from "@prisma/client";
import type { AcademicProgram, GetAcademicProgram, GetSimpleAcademicProgram } from "../../../program/domain/academicProgram.entity.js";
export declare class AcademicProgramMapper {
    static toDomain(prismaProgram: PrismaAcademicProgram): AcademicProgram;
    static toGetAcademicProgram(prismaProgram: PrismaAcademicProgram): GetAcademicProgram;
    static toGetSimpleAcademicProgram(prismaProgram: PrismaAcademicProgram): GetSimpleAcademicProgram;
}
//# sourceMappingURL=academicProgram.mapper.d.ts.map