export class CampusMapper {
    static toDomain(prismaCampus) {
        return {
            id: prismaCampus.id,
            tenantId: prismaCampus.tenantId,
            code: prismaCampus.code,
            name: prismaCampus.name,
            address: prismaCampus.address,
            isActive: prismaCampus.isActive,
            createdAt: prismaCampus.createdAt,
            updatedAt: prismaCampus.updatedAt
        };
    }
    static toGetCampus(prismaCampus) {
        return this.toDomain(prismaCampus);
    }
    static toGetSimpleCampus(prismaCampus) {
        return {
            id: prismaCampus.id,
            tenantId: prismaCampus.tenantId,
            code: prismaCampus.code,
            name: prismaCampus.name,
            address: prismaCampus.address,
            isActive: prismaCampus.isActive,
            createdAt: prismaCampus.createdAt
        };
    }
}
//# sourceMappingURL=campus.mapper.js.map