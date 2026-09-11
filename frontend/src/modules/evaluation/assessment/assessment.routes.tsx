import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RouteProtector } from '../../../shared/components/RouteProtector';

const AssessmentList = lazy(() => import('./presentation/pages/AssessmentList.page'));
const AssessmentCreate = lazy(() => import('./presentation/pages/AssessmentCreate.page'));
const AssessmentEdit = lazy(() => import('./presentation/pages/AssessmentEdit.page'));

const Loader = () => <div>Loading...</div>;

export const assessmentRoutes: RouteObject[] = [
  { index: true, element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="assessments:read"><AssessmentList /></RouteProtector></Suspense> },
  { path: 'create', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="assessments:create"><AssessmentCreate /></RouteProtector></Suspense> },
  { path: ':assessmentId/edit', element: <Suspense fallback={<Loader />}><RouteProtector requiredPermission="assessments:update"><AssessmentEdit /></RouteProtector></Suspense> },
];
