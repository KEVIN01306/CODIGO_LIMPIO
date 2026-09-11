import type { CourseOffering } from '../../courseOffering/domain/courseOffering.interfaces';

export interface StudentProfile {
  id: string;
  userId: string;
  campusId: string;
  studentCode?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CourseEnrollment {
  id: string;
  offeringId: string;
  studentId: string;
  status: 'ENROLLED' | 'COMPLETED' | 'DROPPED' | 'FAILED';
  finalGrade?: number;
  enrolledAt: string;
  updatedAt?: string;
  offering?: CourseOffering;
  student?: StudentProfile;
}

export interface CreateCourseEnrollmentDTO {
  offeringId: string;
  studentId: string;
  status?: string;
}

export interface UpdateCourseEnrollmentDTO {
  status?: string;
  finalGrade?: number | null;
}

export interface CourseEnrollmentFormValues {
  offeringId: string;
  studentId: string;
  status: string;
  finalGrade?: number | null;
}
