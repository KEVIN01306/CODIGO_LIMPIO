import type { RouteObject } from 'react-router-dom';
import { Suspense } from 'react';
import { RouteProtector } from '../../../shared/components/RouteProtector';
import { TeacherList, TeacherCreate, TeacherEdit } from './teacher.lazy';

const Loader = () => <div>Loading...</div>;

// Using users:read, users:create, users:update as standard user permissions.
// If you implement teachers:read specifically, change these permissions appropriately.
export const teacherRoutes: RouteObject[] = [
  { index: true, element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="users:read"><TeacherList /></RouteProtector></Suspense> },
  { path: 'create', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="users:create"><TeacherCreate /></RouteProtector></Suspense> },
  { path: ':id/edit', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="users:update"><TeacherEdit /></RouteProtector></Suspense> },
];
