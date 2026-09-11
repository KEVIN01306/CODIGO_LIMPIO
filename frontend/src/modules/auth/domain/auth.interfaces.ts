export interface AuthUser {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  campusId?: string;
  permissions: string[];
  roles: string[];
  isStudent: boolean;
  isTeacher: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
