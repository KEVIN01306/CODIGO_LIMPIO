export class GetRolesMatrixUseCase {
    rolesRepository;
    constructor(rolesRepository) {
        this.rolesRepository = rolesRepository;
    }
    async execute(tenantId) {
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
//# sourceMappingURL=get-roles-matrix.usecase.js.map