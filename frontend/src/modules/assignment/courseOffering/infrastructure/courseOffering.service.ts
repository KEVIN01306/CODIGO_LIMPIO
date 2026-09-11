import api from '../../../../core/api/axios.config';
import type { CourseOffering, CreateCourseOfferingDTO, UpdateCourseOfferingDTO } from '../domain/courseOffering.interfaces';
import type { PaginatedResponse } from '../../../../core/api/interfaces/api-response.interface';

const API_URL = '/assignments/offerings';

export const getCourseOfferings = async (params?: Record<string, any>): Promise<PaginatedResponse<CourseOffering>> => {
  const response = await api.get(API_URL, { params });
  return response.data;
};

export const getCourseOfferingById = async (id: string): Promise<CourseOffering> => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const createCourseOffering = async (data: CreateCourseOfferingDTO): Promise<CourseOffering> => {
  const response = await api.post(API_URL, data);
  return response.data.data;
};

export const updateCourseOffering = async (id: string, data: UpdateCourseOfferingDTO): Promise<CourseOffering> => {
  const response = await api.put(`${API_URL}/${id}`, data);
  return response.data.data;
};

export const deleteCourseOffering = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
