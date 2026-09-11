import { lazy } from 'react';

export const CourseOfferingList = lazy(() => import('./presentation/pages/CourseOfferingList.page'));
export const CourseOfferingCreate = lazy(() => import('./presentation/pages/CourseOfferingCreate.page'));
export const CourseOfferingEdit = lazy(() => import('./presentation/pages/CourseOfferingEdit.page'));
export const CourseOfferingDetail = lazy(() => import('./presentation/pages/CourseOfferingDetail.page'));
