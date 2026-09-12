export interface AuthUser {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  campusId?: string;
  permissions?: string[];
  roles: string[];
  isStudent: boolean;
  isTeacher: boolean;
}

export interface StudentInfo {
  studentNumber: string;
  campusName: string;
  cohortName?: string;
  programName?: string;
}

export interface TeacherInfo {
  employeeCode?: string | null;
  campusName: string;
}

export interface DetailedUserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  tenantId: string;
  tenantName: string;
  campusId?: string;
  campusName?: string;
  establishment: string;
  roles: string[];
  isStudent: boolean;
  isTeacher: boolean;
  createdAt: string;
  studentInfo?: StudentInfo | null;
  teacherInfo?: TeacherInfo | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}
