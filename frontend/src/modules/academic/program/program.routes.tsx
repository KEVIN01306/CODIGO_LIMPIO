import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RouteProtector } from '../../../shared/components/RouteProtector';

const AcademicProgramList = lazy(() => import('./presentation/pages/AcademicProgramList.page'));
const AcademicProgramCreate = lazy(() => import('./presentation/pages/AcademicProgramCreate.page'));
const AcademicProgramEdit = lazy(() => import('./presentation/pages/AcademicProgramEdit.page'));
const AcademicProgramDetail = lazy(() => import('./presentation/pages/AcademicProgramDetail.page'));

export const programRoutes: RouteObject[] = [
  {
    path: 'programs',
    children: [
      {
        index: true,
        element: <RouteProtector requiredPermission="programs:read"><AcademicProgramList /></RouteProtector>
      },
      {
        path: 'create',
        element: <RouteProtector requiredPermission="programs:create"><AcademicProgramCreate /></RouteProtector>
      },
      {
        path: ':id',
        element: <RouteProtector requiredPermission="programs:read"><AcademicProgramDetail /></RouteProtector>
      },
      {
        path: ':id/edit',
        element: <RouteProtector requiredPermission="programs:update"><AcademicProgramEdit /></RouteProtector>
      }
    ]
  }
];
