import type { RouteObject } from 'react-router-dom';
import { courseOfferingRoutes } from '../courseOffering/courseOffering.routes';
import { courseEnrollmentRoutes } from '../courseEnrollment/courseEnrollment.routes';

export const assignmentRoutes: RouteObject = {
  path: 'assignment',
  children: [
    {
      path: 'offerings',
      children: courseOfferingRoutes
    },
    {
      path: 'enrollments',
      children: courseEnrollmentRoutes
    }
  ]
};
