import type { AcademicProgram } from './academicProgram.interfaces';

export interface Course {
  id: string;
  programId: string;
  code: string;
  name: string;
  description: string | null;
  credits: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  program?: AcademicProgram;
}

export interface CreateCourseDTO {
  programId: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
}

export interface UpdateCourseDTO {
  programId?: string;
  code?: string;
  name?: string;
  description?: string;
  credits?: number;
  isActive?: boolean;
}

export interface CourseFormValues {
  programId: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  isActive: boolean;
}
