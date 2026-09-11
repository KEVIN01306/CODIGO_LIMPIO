import type { RouteObject } from 'react-router-dom';
import { LoginPage } from './auth.lazy';

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <LoginPage />,
  },
];
