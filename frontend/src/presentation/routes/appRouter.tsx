import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { authRoutes } from '../../modules/auth/presentation/auth.routes';
import { dashboardRoutes } from '../../modules/dashboard/presentation/dashboard.routes';
import { academicRoutes } from '../../modules/academic/academic.routes';
import { assignmentRoutes } from '../../modules/assignment/presentation/assignment.routes';

const BlankLayout = lazy(() => import('../layouts/blankLayout/BlankLayout'));
const FullLayout = lazy(() => import('../layouts/fullLayout/FullLayout'));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const AccessDeniedPage = lazy(() => import('../../shared/pages/AccessDeniedPage'));
const ProfilePage = lazy(() => import('../../modules/auth/presentation/pages/Profile.page'));

const FullPageLoader = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
    <CircularProgress />
  </Box>
);

export const appRouter = createBrowserRouter([
  {
    path: '/auth',
    element: (
      <Suspense fallback={<FullPageLoader />}>
        <BlankLayout />
      </Suspense>
    ),
    children: [
      ...authRoutes,
    ],
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<FullPageLoader />}>
        <ProtectedRoute />
      </Suspense>
    ),
    children: [
      {
        element: (
          <Suspense fallback={<FullPageLoader />}>
            <FullLayout />
          </Suspense>
        ),
        children: [
          ...dashboardRoutes,
          ...academicRoutes,
          assignmentRoutes,
          {
            path: 'perfil',
            element: <ProfilePage />,
          },
          {
            path: 'access-denied',
            element: <AccessDeniedPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
