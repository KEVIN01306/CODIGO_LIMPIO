import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RouteProtector } from '../../../shared/components/RouteProtector';

const CourseList = lazy(() => import('./presentation/pages/CourseList.page'));
const CourseCreate = lazy(() => import('./presentation/pages/CourseCreate.page'));
const CourseEdit = lazy(() => import('./presentation/pages/CourseEdit.page'));
const CourseDetail = lazy(() => import('./presentation/pages/CourseDetail.page'));

export const courseRoutes: RouteObject[] = [
  {
    path: 'courses',
    children: [
      {
        index: true,
        element: <RouteProtector requiredPermission="courses:read"><CourseList /></RouteProtector>
      },
      {
        path: 'create',
        element: <RouteProtector requiredPermission="courses:create"><CourseCreate /></RouteProtector>
      },
      {
        path: ':id',
        element: <RouteProtector requiredPermission="courses:read"><CourseDetail /></RouteProtector>
      },
      {
        path: ':id/edit',
        element: <RouteProtector requiredPermission="courses:update"><CourseEdit /></RouteProtector>
      }
    ]
  }
];
