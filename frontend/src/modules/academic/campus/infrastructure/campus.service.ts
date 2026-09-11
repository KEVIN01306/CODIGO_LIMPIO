import api from '../../../../core/api/axios.config';
import type { Campus, CreateCampusDTO, UpdateCampusDTO } from '../../campus/domain/campus.interfaces';
import type { ApiResponse, PaginatedResponse } from '../../../../core/api/interfaces/api-response.interface';

export const getCampuses = async (params: { page: number; perPage: number; q?: string; isActive?: boolean }): Promise<PaginatedResponse<Campus[]>> => {
  const { page, perPage, q, isActive } = params;
  const response = await api.get<PaginatedResponse<Campus[]>>('/academic/campuses', {
    params: {
      offset: (page - 1) * perPage,
      limit: perPage,
      q: q || undefined,
      isActive: isActive !== undefined ? isActive : undefined
    }
  });
  return response.data;
};

export const getCampusById = async (id: string): Promise<Campus> => {
  const response = await api.get<ApiResponse<Campus>>(`/academic/campuses/${id}`);
  return response.data.data;
};

export const createCampus = async (data: CreateCampusDTO): Promise<Campus> => {
  const response = await api.post<ApiResponse<Campus>>('/academic/campuses', data);
  return response.data.data;
};

export const updateCampus = async (id: string, data: UpdateCampusDTO): Promise<Campus> => {
  const response = await api.put<ApiResponse<Campus>>(`/academic/campuses/${id}`, data);
  return response.data.data;
};

export const deleteCampus = async (id: string): Promise<void> => {
  await api.delete(`/academic/campuses/${id}`);
};
