import type { RouteObject } from 'react-router-dom';
import { Suspense } from 'react';
import { RouteProtector } from '../../../shared/components/RouteProtector';
import { CourseEnrollmentList, CourseEnrollmentCreate, CourseEnrollmentEdit, CourseEnrollmentDetail } from './courseEnrollment.lazy';

const Loader = () => <div>Loading...</div>;

export const courseEnrollmentRoutes: RouteObject[] = [
  { index: true, element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseEnrollments:read"><CourseEnrollmentList /></RouteProtector></Suspense> },
  { path: 'create', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseEnrollments:create"><CourseEnrollmentCreate /></RouteProtector></Suspense> },
  { path: ':enrollmentId', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseEnrollments:read"><CourseEnrollmentDetail /></RouteProtector></Suspense> },
  { path: ':enrollmentId/edit', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseEnrollments:update"><CourseEnrollmentEdit /></RouteProtector></Suspense> },
];
