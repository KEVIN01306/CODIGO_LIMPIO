import type { RouteObject } from 'react-router-dom';
import { RouteProtector } from '../../shared/components/RouteProtector';
import { TenantConfigurationPage } from './tenant.lazy';

export const tenantRoutes: RouteObject[] = [
  {
    path: 'admin/tenant',
    element: (
      <RouteProtector requiredPermission="tenant:read">
        <TenantConfigurationPage />
      </RouteProtector>
    ),
  },
];
