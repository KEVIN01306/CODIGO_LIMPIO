import type { Campus as PrismaCampus } from "@prisma/client";
import type { Campus, GetCampus, GetSimpleCampus } from "../../../campus/domain/campus.entity.js";

export class CampusMapper {
    static toDomain(prismaCampus: PrismaCampus): Campus {
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

    static toGetCampus(prismaCampus: PrismaCampus): GetCampus {
        return this.toDomain(prismaCampus);
    }

    static toGetSimpleCampus(prismaCampus: PrismaCampus): GetSimpleCampus {
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
