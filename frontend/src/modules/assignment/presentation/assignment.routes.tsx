import type { RouteObject } from 'react-router-dom';
import { courseOfferingRoutes } from '../courseOffering/courseOffering.routes';


export const assignmentRoutes: RouteObject = {
  path: 'assignment',
  children: [
    {
      path: 'offerings',
      children: courseOfferingRoutes
    }
  ]
};
