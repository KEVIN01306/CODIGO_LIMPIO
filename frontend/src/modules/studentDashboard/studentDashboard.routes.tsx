import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RouteProtector } from '../../shared/components/RouteProtector';

const MyCoursesList = lazy(() => import('./presentation/pages/MyCoursesList.page'));
const MyCourseAssessments = lazy(() => import('./presentation/pages/MyCourseAssessments.page'));
const StudentAssessmentFeedbackPage = lazy(() => import('./presentation/pages/StudentAssessmentFeedback.page'));

const Loader = () => <div>Loading...</div>;

export const studentDashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <Suspense fallback={<Loader />}>
        <RouteProtector requiredPermission="courseEnrollments:read">
          <MyCoursesList />
        </RouteProtector>
      </Suspense>
    )
  },
  {
    path: ':offeringId/assessments',
    element: (
      <Suspense fallback={<Loader />}>
        <RouteProtector requiredPermission="assessments:read">
          <MyCourseAssessments />
        </RouteProtector>
      </Suspense>
    )
  },
  {
    path: ':offeringId/assessments/:assessmentId/feedback',
    element: (
      <Suspense fallback={<Loader />}>
        <RouteProtector requiredPermission="assessments:read">
          <StudentAssessmentFeedbackPage />
        </RouteProtector>
      </Suspense>
    )
  },
];
