import type { IRolesRepository } from "../domain/roles.repository.interface.js";
import type { RolesMatrixResponse } from "../domain/roles.interface.js";

export class GetRolesMatrixUseCase {
    constructor(private readonly rolesRepository: IRolesRepository) {}

    async execute(tenantId: string): Promise<RolesMatrixResponse> {
        const [roles, permissions] = await Promise.all([
            this.rolesRepository.getRolesWithPermissions(tenantId),
            this.rolesRepository.getAllPermissions()
        ]);

        return {
            roles,
            permissions
        };
    }
}
