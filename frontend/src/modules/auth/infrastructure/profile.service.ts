import api from '../../../core/api/axios.config';
import type { ApiResponse } from '../../../core/api/interfaces/api-response.interface';
import type { DetailedUserProfile } from '../domain/auth.interfaces';

export const getProfile = async (): Promise<DetailedUserProfile> => {
  const response = await api.get<ApiResponse<DetailedUserProfile>>('/auth/me');
  return response.data.data;
};
