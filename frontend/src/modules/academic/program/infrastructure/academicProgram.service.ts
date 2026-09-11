import api from '../../../../core/api/axios.config';
import type { AcademicProgram, CreateAcademicProgramDTO, UpdateAcademicProgramDTO } from '../../program/domain/academicProgram.interfaces';
import type { ApiResponse, PaginatedResponse } from '../../../../core/api/interfaces/api-response.interface';

export const getAcademicPrograms = async (params: { page: number; perPage: number; q?: string }): Promise<PaginatedResponse<AcademicProgram[]>> => {
  const { page, perPage, q } = params;
  const response = await api.get<PaginatedResponse<AcademicProgram[]>>('/academic/programs', {
    params: {
      offset: (page - 1) * perPage,
      limit: perPage,
      q: q || undefined
    }
  });
  return response.data;
};

export const getAcademicProgramById = async (id: string): Promise<AcademicProgram> => {
  const response = await api.get<ApiResponse<AcademicProgram>>(`/academic/programs/${id}`);
  return response.data.data;
};

export const createAcademicProgram = async (data: CreateAcademicProgramDTO): Promise<AcademicProgram> => {
  const response = await api.post<ApiResponse<AcademicProgram>>('/academic/programs', data);
  return response.data.data;
};

export const updateAcademicProgram = async (id: string, data: UpdateAcademicProgramDTO): Promise<AcademicProgram> => {
  const response = await api.put<ApiResponse<AcademicProgram>>(`/academic/programs/${id}`, data);
  return response.data.data;
};

export const deleteAcademicProgram = async (id: string): Promise<void> => {
  await api.delete(`/academic/programs/${id}`);
};
