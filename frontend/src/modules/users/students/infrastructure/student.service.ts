import api from '../../../../core/api/axios.config';
import type { StudentProfile, CreateStudentDTO, UpdateStudentDTO } from '../domain/student.interfaces';
import type { PaginatedResponse } from '../../../../core/api/interfaces/api-response.interface';

export const getStudents = async (params?: { page?: number; perPage?: number; q?: string }) => {
  const response = await api.get<PaginatedResponse<StudentProfile>>('/users/students', { params });
  return response.data;
};

export const getStudentById = async (id: string) => {
  const response = await api.get<{ data: StudentProfile }>(`/users/students/${id}`);
  return response.data.data;
};

export const createStudent = async (data: CreateStudentDTO) => {
  const response = await api.post<{ data: StudentProfile }>('/users/students', data);
  return response.data.data;
};

export const updateStudent = async (id: string, data: UpdateStudentDTO) => {
  const response = await api.put<{ data: StudentProfile }>(`/users/students/${id}`, data);
  return response.data.data;
};

export const deleteStudent = async (id: string) => {
  const response = await api.delete(`/users/students/${id}`);
  return response.data;
};
