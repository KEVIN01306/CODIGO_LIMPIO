import api from '../../../core/api/axios.config';
import type { LoginFormValues } from '../domain/auth.schemas';
import type { LoginResponse } from '../domain/auth.interfaces';
import type { ApiResponse } from '../../../core/api/interfaces/api-response.interface';

export const login = async (data: LoginFormValues): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
  return response.data.data;
};
