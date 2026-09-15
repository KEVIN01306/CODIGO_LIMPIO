import type { RouteObject } from 'react-router-dom';
import { RouteProtector } from '../../shared/components/RouteProtector';
import { RolesPermissionsPage } from './roles.lazy';

export const rolesRoutes: RouteObject[] = [
  {
    path: 'admin/roles',
    element: (
      <RouteProtector requiredPermission="roles:read">
        <RolesPermissionsPage />
      </RouteProtector>
    ),
  },
];
