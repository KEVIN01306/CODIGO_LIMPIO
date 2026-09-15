import api from '../../../core/api/axios.config';
import type { ApiResponse } from '../../../core/api/interfaces/api-response.interface';
import type { RolesMatrixData } from '../domain/roles.interfaces';

export const getRolesMatrix = async (): Promise<RolesMatrixData> => {
  const response = await api.get<ApiResponse<RolesMatrixData>>('/roles/matrix');
  return response.data.data;
};
