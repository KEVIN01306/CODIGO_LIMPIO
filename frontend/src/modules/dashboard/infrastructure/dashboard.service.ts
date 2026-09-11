import api from '../../../core/api/axios.config';
import type { DashboardSummary } from '../domain/dashboard.interfaces';
import type { ApiResponse } from '../../../core/api/interfaces/api-response.interface';

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
    const response = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    return response.data.data;
};
