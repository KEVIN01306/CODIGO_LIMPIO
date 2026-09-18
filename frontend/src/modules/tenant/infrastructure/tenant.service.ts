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
  data: UpdateSebConfigDTO | FormData
): Promise<SebConfiguration> => {
  if (data instanceof FormData) {
    const response = await api.put<ApiResponse<SebConfiguration>>('/tenant/configuration/seb', data);
    return response.data.data;
  }

  if (data.file) {
    const formData = new FormData();
    if (data.defaultSebConfigKey !== undefined && data.defaultSebConfigKey !== null) {
      formData.append('defaultSebConfigKey', data.defaultSebConfigKey);
    }
    formData.append('file', data.file);
    const response = await api.put<ApiResponse<SebConfiguration>>('/tenant/configuration/seb', formData);
    return response.data.data;
  }

  const response = await api.put<ApiResponse<SebConfiguration>>('/tenant/configuration/seb', data);
  return response.data.data;
};
