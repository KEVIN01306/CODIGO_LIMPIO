import api from '../../../../core/api/axios.config';
import type { Cohort, CreateCohortDTO, UpdateCohortDTO } from '../../cohort/domain/cohort.interfaces';
import type { ApiResponse, PaginatedResponse } from '../../../../core/api/interfaces/api-response.interface';

export const getCohorts = async (params: { page: number; perPage: number; q?: string; campusId?: string; programId?: string }): Promise<PaginatedResponse<Cohort[]>> => {
  const { page, perPage, q, campusId, programId } = params;
  const response = await api.get<PaginatedResponse<Cohort[]>>('/academic/cohorts', {
    params: {
      offset: (page - 1) * perPage,
      limit: perPage,
      q: q || undefined,
      campusId: campusId || undefined,
      programId: programId || undefined
    }
  });
  return response.data;
};

export const getCohortById = async (id: string): Promise<Cohort> => {
  const response = await api.get<ApiResponse<Cohort>>(`/academic/cohorts/${id}`);
  return response.data.data;
};

export const createCohort = async (data: CreateCohortDTO): Promise<Cohort> => {
  const response = await api.post<ApiResponse<Cohort>>('/academic/cohorts', data);
  return response.data.data;
};

export const updateCohort = async (id: string, data: UpdateCohortDTO): Promise<Cohort> => {
  const response = await api.put<ApiResponse<Cohort>>(`/academic/cohorts/${id}`, data);
  return response.data.data;
};

export const deleteCohort = async (id: string): Promise<void> => {
  await api.delete(`/academic/cohorts/${id}`);
};
