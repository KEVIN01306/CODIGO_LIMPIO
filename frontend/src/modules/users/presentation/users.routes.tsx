import type { RouteObject } from 'react-router-dom';
import { teacherRoutes } from '../teachers/teacher.routes';
import { studentRoutes } from '../students/student.routes';

export const usersRoutes: RouteObject = {
  path: 'users',
  children: [
    {
      path: 'teachers',
      children: teacherRoutes
    },
    {
      path: 'students',
      children: studentRoutes
    }
  ]
};
