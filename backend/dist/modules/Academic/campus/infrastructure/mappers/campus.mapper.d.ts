import type { Campus as PrismaCampus } from "@prisma/client";
import type { Campus, GetCampus, GetSimpleCampus } from "../../../campus/domain/campus.entity.js";
export declare class CampusMapper {
    static toDomain(prismaCampus: PrismaCampus): Campus;
    static toGetCampus(prismaCampus: PrismaCampus): GetCampus;
    static toGetSimpleCampus(prismaCampus: PrismaCampus): GetSimpleCampus;
}
//# sourceMappingURL=campus.mapper.d.ts.map