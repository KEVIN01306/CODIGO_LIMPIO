import type { RouteObject } from 'react-router-dom';
import { Suspense } from 'react';
import { RouteProtector } from '../../../shared/components/RouteProtector';
import { CourseOfferingList, CourseOfferingCreate, CourseOfferingEdit, CourseOfferingDetail } from './courseOffering.lazy';

import { courseEnrollmentRoutes } from '../courseEnrollment/courseEnrollment.routes';
import { assessmentRoutes } from '../../evaluation/assessment/assessment.routes';

const Loader = () => <div>Loading...</div>;

export const courseOfferingRoutes: RouteObject[] = [
  { index: true, element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:read"><CourseOfferingList /></RouteProtector></Suspense> },
  { path: 'create', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:create"><CourseOfferingCreate /></RouteProtector></Suspense> },
  { path: ':id', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:read"><CourseOfferingDetail /></RouteProtector></Suspense> },
  { path: ':id/edit', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:update"><CourseOfferingEdit /></RouteProtector></Suspense> },
  { path: ':id/enrollments', children: courseEnrollmentRoutes },
  { path: ':id/assessments', children: assessmentRoutes },
];
