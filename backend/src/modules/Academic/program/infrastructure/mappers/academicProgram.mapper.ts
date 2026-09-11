import type { AcademicProgram as PrismaAcademicProgram } from "@prisma/client";
import type { AcademicProgram, GetAcademicProgram, GetSimpleAcademicProgram } from "../../../program/domain/academicProgram.entity.js";

export class AcademicProgramMapper {
    static toDomain(prismaProgram: PrismaAcademicProgram): AcademicProgram {
        return {
            id: prismaProgram.id,
            tenantId: prismaProgram.tenantId,
            code: prismaProgram.code,
            name: prismaProgram.name,
            createdAt: prismaProgram.createdAt,
            updatedAt: prismaProgram.updatedAt
        };
    }

    static toGetAcademicProgram(prismaProgram: PrismaAcademicProgram): GetAcademicProgram {
        return this.toDomain(prismaProgram);
    }

    static toGetSimpleAcademicProgram(prismaProgram: PrismaAcademicProgram): GetSimpleAcademicProgram {
        return {
            id: prismaProgram.id,
            code: prismaProgram.code,
            name: prismaProgram.name,
            createdAt: prismaProgram.createdAt
        };
    }
}
