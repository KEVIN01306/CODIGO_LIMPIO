import { lazy } from 'react';

export const StudentList = lazy(() => import('./presentation/pages/StudentList.page'));
export const StudentCreate = lazy(() => import('./presentation/pages/StudentCreate.page'));
export const StudentEdit = lazy(() => import('./presentation/pages/StudentEdit.page'));
