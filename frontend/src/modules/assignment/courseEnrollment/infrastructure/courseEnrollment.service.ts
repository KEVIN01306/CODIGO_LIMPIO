import api from '../../../../core/api/axios.config';
import type { CourseEnrollment, CreateCourseEnrollmentDTO, UpdateCourseEnrollmentDTO } from '../domain/courseEnrollment.interfaces';
import type { PaginatedResponse } from '../../../../core/api/interfaces/api-response.interface';

const API_URL = '/assignments/enrollments';

export const getCourseEnrollments = async (params?: { offeringId?: string; page?: number; perPage?: number; q?: string }): Promise<PaginatedResponse<CourseEnrollment>> => {
  const response = await api.get(API_URL, { params });
  return response.data;
};

export const getCourseEnrollmentById = async (id: string): Promise<CourseEnrollment> => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const createCourseEnrollment = async (data: CreateCourseEnrollmentDTO): Promise<CourseEnrollment> => {
  const response = await api.post(API_URL, data);
  return response.data.data;
};

export const updateCourseEnrollment = async (id: string, data: UpdateCourseEnrollmentDTO): Promise<CourseEnrollment> => {
  const response = await api.put(`${API_URL}/${id}`, data);
  return response.data.data;
};

export const deleteCourseEnrollment = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
