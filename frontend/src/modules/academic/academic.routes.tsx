import type { RouteObject } from 'react-router-dom';
import { campusRoutes } from './campus/campus.routes';
import { programRoutes } from './program/program.routes';
import { cohortRoutes } from './cohort/cohort.routes';
import { cycleRoutes } from './cycle/cycle.routes';
import { courseRoutes } from './course/course.routes';

export const academicRoutes: RouteObject[] = [
  {
    path: '/academic',
    children: [
      ...campusRoutes,
      ...programRoutes,
      ...cohortRoutes,
      ...cycleRoutes,
      ...courseRoutes
    ]
  }
];