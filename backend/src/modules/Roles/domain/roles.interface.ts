export interface RoleWithPermissions {
    id: string;
    name: string;
    description?: string | null;
    isSystem: boolean;
    permissions: string[];
}

export interface PermissionItem {
    id: string;
    action: string;
    description?: string | null;
}

export interface RolesMatrixResponse {
    roles: RoleWithPermissions[];
    permissions: PermissionItem[];
}
