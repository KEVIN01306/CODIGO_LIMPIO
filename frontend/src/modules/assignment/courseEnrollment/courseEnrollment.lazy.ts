import { lazy } from 'react';

export const CourseEnrollmentList = lazy(() => import('./presentation/pages/CourseEnrollmentList.page'));
export const CourseEnrollmentCreate = lazy(() => import('./presentation/pages/CourseEnrollmentCreate.page'));
export const CourseEnrollmentEdit = lazy(() => import('./presentation/pages/CourseEnrollmentEdit.page'));
export const CourseEnrollmentDetail = lazy(() => import('./presentation/pages/CourseEnrollmentDetail.page'));
