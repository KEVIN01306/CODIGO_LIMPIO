import type { PermissionItem, ParsedPermission, PermissionModuleGroup } from './roles.interfaces';

const ACTION_ORDER_PRIORITY: Record<string, number> = {
  READ: 1,
  VIEW: 2,
  LIST: 3,
  CREATE: 4,
  UPDATE: 5,
  EDIT: 6,
  DELETE: 7,
};

/**
 * Parses a permission action string (e.g., 'campuses:read', 'courseOfferings:create', 'AUTH_LOGIN')
 * into a structured ParsedPermission object with dynamically extracted module and action names.
 */
export function parsePermission(permission: PermissionItem): ParsedPermission {
  const raw = (permission.action || '').trim();
  let rawModule = '';
  let rawAction = '';

  if (raw.includes(':')) {
    const parts = raw.split(':');
    rawModule = parts[0];
    rawAction = parts.slice(1).join(':');
  } else if (raw.includes('_')) {
    const parts = raw.split('_');
    rawModule = parts[0];
    rawAction = parts.slice(1).join('_');
  } else if (raw.includes('-')) {
    const parts = raw.split('-');
    rawModule = parts[0];
    rawAction = parts.slice(1).join('-');
  } else {
    rawModule = 'GENERAL';
    rawAction = raw;
  }

  // Format module name: 'courseOfferings' -> 'COURSE OFFERINGS'
  const moduleName = rawModule
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .trim()
    .toUpperCase();

  // Format action name: 'read' -> 'READ'
  const actionName = rawAction
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .trim()
    .toUpperCase();

  return {
    id: permission.id,
    action: raw,
    module: moduleName || 'GENERAL',
    actionName: actionName || raw,
    description: permission.description,
  };
}

/**
 * Groups permissions dynamically by module without any hardcoded module list.
 * Sorts modules alphabetically and permissions with standard operational order.
 */
export function groupPermissionsByModule(
  permissions: PermissionItem[],
  filterQuery: string = ''
): PermissionModuleGroup[] {
  const normalizedQuery = filterQuery.trim().toLowerCase();

  const parsed = permissions.map(parsePermission);

  const filtered = normalizedQuery
    ? parsed.filter(
        (p) =>
          p.module.toLowerCase().includes(normalizedQuery) ||
          p.actionName.toLowerCase().includes(normalizedQuery) ||
          p.action.toLowerCase().includes(normalizedQuery) ||
          (p.description && p.description.toLowerCase().includes(normalizedQuery))
      )
    : parsed;

  // Group by module name
  const groupsMap = new Map<string, ParsedPermission[]>();

  for (const perm of filtered) {
    const existing = groupsMap.get(perm.module);
    if (existing) {
      existing.push(perm);
    } else {
      groupsMap.set(perm.module, [perm]);
    }
  }

  // Sort groups alphabetically by module
  const sortedModuleNames = Array.from(groupsMap.keys()).sort((a, b) =>
    a.localeCompare(b)
  );

  return sortedModuleNames.map((moduleName) => {
    const modulePerms = groupsMap.get(moduleName) || [];

    // Sort permissions within group: READ/CREATE/UPDATE/DELETE priority, then alphabetical
    modulePerms.sort((a, b) => {
      const priorityA = ACTION_ORDER_PRIORITY[a.actionName] ?? 99;
      const priorityB = ACTION_ORDER_PRIORITY[b.actionName] ?? 99;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.actionName.localeCompare(b.actionName);
    });

    return {
      module: moduleName,
      permissions: modulePerms,
    };
  });
}
