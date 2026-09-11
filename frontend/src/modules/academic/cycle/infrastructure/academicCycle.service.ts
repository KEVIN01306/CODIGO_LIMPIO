import api from '../../../../core/api/axios.config';
import type { AcademicCycle, CreateAcademicCycleDTO, UpdateAcademicCycleDTO } from '../../cycle/domain/academicCycle.interfaces';
import type { ApiResponse, PaginatedResponse } from '../../../../core/api/interfaces/api-response.interface';

export const getAcademicCycles = async (params: { page: number; perPage: number; q?: string; cohortId?: string }): Promise<PaginatedResponse<AcademicCycle[]>> => {
  const { page, perPage, q, cohortId } = params;
  const response = await api.get<PaginatedResponse<AcademicCycle[]>>('/academic/cycles', {
    params: {
      offset: (page - 1) * perPage,
      limit: perPage,
      q: q || undefined,
      cohortId: cohortId || undefined
    }
  });
  return response.data;
};

export const getAcademicCycleById = async (id: string): Promise<AcademicCycle> => {
  const response = await api.get<ApiResponse<AcademicCycle>>(`/academic/cycles/${id}`);
  return response.data.data;
};

export const createAcademicCycle = async (data: CreateAcademicCycleDTO): Promise<AcademicCycle> => {
  const response = await api.post<ApiResponse<AcademicCycle>>('/academic/cycles', data);
  return response.data.data;
};

export const updateAcademicCycle = async (id: string, data: UpdateAcademicCycleDTO): Promise<AcademicCycle> => {
  const response = await api.put<ApiResponse<AcademicCycle>>(`/academic/cycles/${id}`, data);
  return response.data.data;
};

export const deleteAcademicCycle = async (id: string): Promise<void> => {
  await api.delete(`/academic/cycles/${id}`);
};
