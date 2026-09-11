import api from '../../../../core/api/axios.config';
import type { Assessment, CreateAssessmentDTO, UpdateAssessmentDTO } from '../domain/assessment.interfaces';
import type { PaginatedResponse } from '../../../../core/api/interfaces/api-response.interface';

const API_URL = '/evaluations/assessments';

export const getAssessments = async (params?: { offeringId?: string; type?: string; page?: number; perPage?: number; q?: string }): Promise<PaginatedResponse<Assessment>> => {
  const response = await api.get(API_URL, { params });
  return response.data;
};

export const getAssessmentById = async (id: string): Promise<Assessment> => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const createAssessment = async (data: CreateAssessmentDTO): Promise<Assessment> => {
  const response = await api.post(API_URL, data);
  return response.data.data;
};

export const updateAssessment = async (id: string, data: UpdateAssessmentDTO): Promise<Assessment> => {
  const response = await api.put(`${API_URL}/${id}`, data);
  return response.data.data;
};

export const deleteAssessment = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
