import { publicApi } from '../../../core/api/axios.config';
import type { LoginFormValues } from '../domain/auth.schemas';
import type { LoginResponse } from '../domain/auth.interfaces';
import type { ApiResponse } from '../../../core/api/interfaces/api-response.interface';
import { useAuthStore } from '../../../core/store/auth.store';

export const login = async (data: LoginFormValues): Promise<LoginResponse> => {
  const response = await publicApi.post<ApiResponse<LoginResponse>>('/auth/login', data);
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  try {
    await publicApi.post('/auth/logout');
  } catch (err) {
    console.warn('Backend logout failed:', err);
  } finally {
    useAuthStore.getState().clearAuth();
  }
};
