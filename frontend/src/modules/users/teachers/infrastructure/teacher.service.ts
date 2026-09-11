import api from '../../../../core/api/axios.config';
import type { TeacherProfile, CreateTeacherDTO, UpdateTeacherDTO } from '../domain/teacher.interfaces';
import type { PaginatedResponse } from '../../../../core/api/interfaces/api-response.interface';

export const getTeachers = async (params?: { page?: number; perPage?: number; q?: string }) => {
  const response = await api.get<PaginatedResponse<TeacherProfile>>('/users/teachers', { params });
  return response.data;
};

export const getTeacherById = async (id: string) => {
  const response = await api.get<{ data: TeacherProfile }>(`/users/teachers/${id}`);
  return response.data.data;
};

export const createTeacher = async (data: CreateTeacherDTO) => {
  const response = await api.post<{ data: TeacherProfile }>('/users/teachers', data);
  return response.data.data;
};

export const updateTeacher = async (id: string, data: UpdateTeacherDTO) => {
  const response = await api.put<{ data: TeacherProfile }>(`/users/teachers/${id}`, data);
  return response.data.data;
};

export const deleteTeacher = async (id: string) => {
  const response = await api.delete(`/users/teachers/${id}`);
  return response.data;
};
