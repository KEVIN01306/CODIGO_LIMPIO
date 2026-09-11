import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RouteProtector } from '../../../shared/components/RouteProtector';

const CohortList = lazy(() => import('./presentation/pages/CohortList.page'));
const CohortCreate = lazy(() => import('./presentation/pages/CohortCreate.page'));
const CohortEdit = lazy(() => import('./presentation/pages/CohortEdit.page'));
const CohortDetail = lazy(() => import('./presentation/pages/CohortDetail.page'));

export const cohortRoutes: RouteObject[] = [
  {
    path: 'cohorts',
    children: [
      {
        index: true,
        element: <RouteProtector requiredPermission="cohorts:read"><CohortList /></RouteProtector>
      },
      {
        path: 'create',
        element: <RouteProtector requiredPermission="cohorts:create"><CohortCreate /></RouteProtector>
      },
      {
        path: ':id',
        element: <RouteProtector requiredPermission="cohorts:read"><CohortDetail /></RouteProtector>
      },
      {
        path: ':id/edit',
        element: <RouteProtector requiredPermission="cohorts:update"><CohortEdit /></RouteProtector>
      }
    ]
  }
];
