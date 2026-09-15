import { lazy } from 'react';

export const RolesPermissionsPage = lazy(
  () => import('./presentation/pages/RolesPermissions.page')
);
