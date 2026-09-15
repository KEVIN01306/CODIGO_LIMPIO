import api from '../../../core/api/axios.config';
import type { ApiResponse } from '../../../core/api/interfaces/api-response.interface';
import type {
  TenantConfiguration,
  UpdateTenantDTO,
  SebConfiguration,
  UpdateSebConfigDTO,
} from '../domain/tenant.interfaces';

export const getTenantConfiguration = async (): Promise<TenantConfiguration> => {
  const response = await api.get<ApiResponse<TenantConfiguration>>('/tenant/configuration');
  return response.data.data;
};

export const updateTenantConfiguration = async (
  data: UpdateTenantDTO
): Promise<TenantConfiguration> => {
  const response = await api.put<ApiResponse<TenantConfiguration>>('/tenant/configuration', data);
  return response.data.data;
};

export const getSebConfiguration = async (): Promise<SebConfiguration> => {
  const response = await api.get<ApiResponse<SebConfiguration>>('/tenant/configuration/seb');
  return response.data.data;
};

export const updateSebConfiguration = async (
  data: UpdateSebConfigDTO
): Promise<SebConfiguration> => {
  const response = await api.put<ApiResponse<SebConfiguration>>('/tenant/configuration/seb', data);
  return response.data.data;
};
