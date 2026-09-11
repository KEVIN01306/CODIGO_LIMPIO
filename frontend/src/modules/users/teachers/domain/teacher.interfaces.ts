import type { Campus } from '../../../academic/campus/domain/campus.interfaces';
import type { User } from '../../domain/user.interfaces';

export interface TeacherProfile {
  id: string;
  userId: string;
  campusId: string;
  employeeCode?: string;
  createdAt: string;
  updatedAt?: string;
  user?: User;
  campus?: Campus;
}

export interface CreateTeacherDTO {
  email: string;
  passwordRaw: string;
  firstName: string;
  lastName: string;
  campusId: string;
  employeeCode?: string;
}

export interface UpdateTeacherDTO {
  firstName?: string;
  lastName?: string;
  campusId?: string;
  employeeCode?: string;
}

export interface TeacherFormValues {
  email: string;
  passwordRaw: string;
  firstName: string;
  lastName: string;
  campusId: string;
  employeeCode?: string;
}
