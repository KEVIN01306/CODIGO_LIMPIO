export interface RoleItem {
  id: string;
  name: string;
  description?: string | null;
  isSystem?: boolean;
  permissions: string[];
}

export interface PermissionItem {
  id: string;
  action: string;
  description?: string | null;
}

export interface RolesMatrixData {
  roles: RoleItem[];
  permissions: PermissionItem[];
}

export interface ParsedPermission {
  id: string;
  action: string;
  module: string;
  actionName: string;
  description?: string | null;
}

export interface PermissionModuleGroup {
  module: string;
  permissions: ParsedPermission[];
}
