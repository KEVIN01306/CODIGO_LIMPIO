import type { Campus } from '../../../academic/campus/domain/campus.interfaces';
import type { Course } from '../../../academic/course/domain/course.interfaces';
import type { AcademicCycle } from '../../../academic/cycle/domain/academicCycle.interfaces';

export interface TeacherProfile {
  id: string;
  userId: string;
  campusId: string;
  employeeCode?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CourseOffering {
  id: string;
  campusId: string;
  courseId: string;
  cycleId: string;
  teacherId?: string;
  section: string;
  createdAt: string;
  updatedAt?: string;
  campus?: Campus;
  course?: Course;
  cycle?: AcademicCycle;
  teacher?: TeacherProfile;
}

export interface CreateCourseOfferingDTO {
  campusId: string;
  courseId: string;
  cycleId: string;
  teacherId?: string;
  section: string;
}

export interface UpdateCourseOfferingDTO {
  campusId?: string;
  courseId?: string;
  cycleId?: string;
  teacherId?: string;
  section?: string;
}

export interface CourseOfferingFormValues {
  campusId: string;
  courseId: string;
  cycleId: string;
  teacherId: string;
  section: string;
}
