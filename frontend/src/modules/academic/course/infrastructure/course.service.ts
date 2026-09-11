import api from '../../../../core/api/axios.config';
import type { Course, CreateCourseDTO, UpdateCourseDTO } from '../../course/domain/course.interfaces';
import type { ApiResponse, PaginatedApiResponse } from '../../../../core/api/interfaces/api-response.interface';

export const getCourses = async (params: { page: number; perPage: number; q?: string; programId?: string; isActive?: boolean }): Promise<PaginatedApiResponse<Course[]>> => {
  const { page, perPage, q, programId, isActive } = params;
  const response = await api.get<PaginatedApiResponse<Course[]>>('/academic/courses', {
    params: {
      offset: (page - 1) * perPage,
      limit: perPage,
      q: q || undefined,
      programId: programId || undefined,
      isActive: isActive !== undefined ? isActive : undefined
    }
  });
  return response.data;
};

export const getCourseById = async (id: string): Promise<Course> => {
  const response = await api.get<ApiResponse<Course>>(`/academic/courses/${id}`);
  return response.data.data;
};

export const createCourse = async (data: CreateCourseDTO): Promise<Course> => {
  const response = await api.post<ApiResponse<Course>>('/academic/courses', data);
  return response.data.data;
};

export const updateCourse = async (id: string, data: UpdateCourseDTO): Promise<Course> => {
  const response = await api.put<ApiResponse<Course>>(`/academic/courses/${id}`, data);
  return response.data.data;
};

export const deleteCourse = async (id: string): Promise<void> => {
  await api.delete(`/academic/courses/${id}`);
};
