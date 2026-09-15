import { lazy } from 'react';

export const TenantConfigurationPage = lazy(
  () => import('./presentation/pages/TenantConfiguration.page')
);
