import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RouteProtector } from '../../../shared/components/RouteProtector';

const CampusList = lazy(() => import('./presentation/pages/CampusList.page'));
const CampusCreate = lazy(() => import('./presentation/pages/CampusCreate.page'));
const CampusEdit = lazy(() => import('./presentation/pages/CampusEdit.page'));
const CampusDetail = lazy(() => import('./presentation/pages/CampusDetail.page'));

export const campusRoutes: RouteObject[] = [
  {
    path: 'campuses',
    children: [
      {
        index: true,
        element: <RouteProtector requiredPermission="campuses:read"><CampusList /></RouteProtector>
      },
      {
        path: 'create',
        element: <RouteProtector requiredPermission="campuses:create"><CampusCreate /></RouteProtector>
      },
      {
        path: ':id',
        element: <RouteProtector requiredPermission="campuses:read"><CampusDetail /></RouteProtector>
      },
      {
        path: ':id/edit',
        element: <RouteProtector requiredPermission="campuses:update"><CampusEdit /></RouteProtector>
      }
    ]
  },
];
