import type { RouteObject } from 'react-router-dom';
import { Suspense } from 'react';
import { RouteProtector } from '../../../shared/components/RouteProtector';
import { CourseOfferingList, CourseOfferingCreate, CourseOfferingEdit, CourseOfferingDetail } from './courseOffering.lazy';

const Loader = () => <div>Loading...</div>;

export const courseOfferingRoutes: RouteObject[] = [
  { index: true, element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:read"><CourseOfferingList /></RouteProtector></Suspense> },
  { path: 'create', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:create"><CourseOfferingCreate /></RouteProtector></Suspense> },
  { path: ':id', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:read"><CourseOfferingDetail /></RouteProtector></Suspense> },
  { path: ':id/edit', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="courseOfferings:update"><CourseOfferingEdit /></RouteProtector></Suspense> },
];
