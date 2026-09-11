import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RouteProtector } from '../../../shared/components/RouteProtector';

const AcademicCycleList = lazy(() => import('./presentation/pages/AcademicCycleList.page'));
const AcademicCycleCreate = lazy(() => import('./presentation/pages/AcademicCycleCreate.page'));
const AcademicCycleEdit = lazy(() => import('./presentation/pages/AcademicCycleEdit.page'));
const AcademicCycleDetail = lazy(() => import('./presentation/pages/AcademicCycleDetail.page'));

export const cycleRoutes: RouteObject[] = [
  {
    path: 'cycles',
    children: [
      {
        index: true,
        element: <RouteProtector requiredPermission="cycles:read"><AcademicCycleList /></RouteProtector>
      },
      {
        path: 'create',
        element: <RouteProtector requiredPermission="cycles:create"><AcademicCycleCreate /></RouteProtector>
      },
      {
        path: ':id',
        element: <RouteProtector requiredPermission="cycles:read"><AcademicCycleDetail /></RouteProtector>
      },
      {
        path: ':id/edit',
        element: <RouteProtector requiredPermission="cycles:update"><AcademicCycleEdit /></RouteProtector>
      }
    ]
  }
];
