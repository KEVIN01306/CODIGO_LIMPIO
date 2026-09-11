import { lazy } from 'react';

export const TeacherList = lazy(() => import('./presentation/pages/TeacherList.page'));
export const TeacherCreate = lazy(() => import('./presentation/pages/TeacherCreate.page'));
export const TeacherEdit = lazy(() => import('./presentation/pages/TeacherEdit.page'));
