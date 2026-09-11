import type { Campus } from '../../../academic/campus/domain/campus.interfaces';
import type { User } from '../../domain/user.interfaces';

export interface StudentProfile {
  id: string;
  userId: string;
  campusId: string;
  studentNumber: string;
  createdAt: string;
  updatedAt?: string;
  user?: User;
  campus?: Campus;
}

export interface CreateStudentDTO {
  email: string;
  passwordRaw: string;
  firstName: string;
  lastName: string;
  campusId: string;
  studentNumber: string;
}

export interface UpdateStudentDTO {
  firstName?: string;
  lastName?: string;
  campusId?: string;
  studentNumber?: string;
}

export interface StudentFormValues {
  email: string;
  passwordRaw: string;
  firstName: string;
  lastName: string;
  campusId: string;
  studentNumber: string;
}
