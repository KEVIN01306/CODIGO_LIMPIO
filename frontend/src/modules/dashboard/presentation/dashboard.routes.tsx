import type { RouteObject } from 'react-router-dom';
import { DashboardPage } from './dashboard.lazy';

export const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: <DashboardPage />,
  },
];

