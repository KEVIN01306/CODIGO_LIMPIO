import api from '../../../core/api/axios.config';
import type { ApiResponse } from '../../../core/api/interfaces/api-response.interface';
import type { AuthUser } from '../domain/auth.interfaces';

export const getProfile = async (): Promise<AuthUser> => {
    const response = await api.get<ApiResponse<AuthUser>>('/auth/me');
    return response.data.data;
};
