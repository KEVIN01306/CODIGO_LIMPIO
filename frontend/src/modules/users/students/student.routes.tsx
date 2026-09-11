import type { RouteObject } from 'react-router-dom';
import { Suspense } from 'react';
import { RouteProtector } from '../../../shared/components/RouteProtector';
import { StudentList, StudentCreate, StudentEdit } from './student.lazy';

const Loader = () => <div>Loading...</div>;

export const studentRoutes: RouteObject[] = [
  { index: true, element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="users:read"><StudentList /></RouteProtector></Suspense> },
  { path: 'create', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="users:create"><StudentCreate /></RouteProtector></Suspense> },
  { path: ':id/edit', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="users:update"><StudentEdit /></RouteProtector></Suspense> },
];
