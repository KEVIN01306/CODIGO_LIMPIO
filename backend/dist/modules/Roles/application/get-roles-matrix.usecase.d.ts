import type { IRolesRepository } from "../domain/roles.repository.interface.js";
import type { RolesMatrixResponse } from "../domain/roles.interface.js";
export declare class GetRolesMatrixUseCase {
    private readonly rolesRepository;
    constructor(rolesRepository: IRolesRepository);
    execute(tenantId: string): Promise<RolesMatrixResponse>;
}
//# sourceMappingURL=get-roles-matrix.usecase.d.ts.map