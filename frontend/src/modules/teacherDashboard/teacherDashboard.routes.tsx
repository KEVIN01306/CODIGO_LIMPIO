import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { RouteProtector } from '../../shared/components/RouteProtector';

const TaughtCoursesList = lazy(() => import('./presentation/pages/TaughtCoursesList.page'));

const Loader = () => <div>Loading...</div>;

export const teacherDashboardRoutes: RouteObject[] = [
  {
    path: 'taught-courses',
    element: (
      <RouteProtector requiredPermission="courseOfferings:read">
        <Suspense fallback={<Loader />}>
          <TaughtCoursesList />
        </Suspense>
      </RouteProtector>
    ),
  },
];
