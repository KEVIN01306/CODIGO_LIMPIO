import { lazy, Suspense } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { RouteProtector } from '../../shared/components/RouteProtector';

const MyCoursesList = lazy(() => import('./presentation/pages/MyCoursesList.page'));
const MyCourseOverview = lazy(() => import('./presentation/pages/MyCourseOverview.page'));
const MyCourseAssessments = lazy(() => import('./presentation/pages/MyCourseAssessments.page'));
const MyCourseGrades = lazy(() => import('./presentation/pages/MyCourseGrades.page'));
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
    path: ':offeringId',
    element: <Navigate to="assessments" replace />
  },
  {
    path: ':offeringId/overview',
    element: (
      <Suspense fallback={<Loader />}>
        <RouteProtector requiredPermission="courseEnrollments:read">
          <MyCourseOverview />
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
    path: ':offeringId/grades',
    element: (
      <Suspense fallback={<Loader />}>
        <RouteProtector requiredPermission="assessments:read">
          <MyCourseGrades />
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
