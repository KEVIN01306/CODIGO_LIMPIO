export class AcademicProgramMapper {
    static toDomain(prismaProgram) {
        return {
            id: prismaProgram.id,
            tenantId: prismaProgram.tenantId,
            code: prismaProgram.code,
            name: prismaProgram.name,
            createdAt: prismaProgram.createdAt,
            updatedAt: prismaProgram.updatedAt
        };
    }
    static toGetAcademicProgram(prismaProgram) {
        return this.toDomain(prismaProgram);
    }
    static toGetSimpleAcademicProgram(prismaProgram) {
        return {
            id: prismaProgram.id,
            code: prismaProgram.code,
            name: prismaProgram.name,
            createdAt: prismaProgram.createdAt
        };
    }
}
//# sourceMappingURL=academicProgram.mapper.js.map