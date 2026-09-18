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

export const createAssessment = async (data: CreateAssessmentDTO | FormData): Promise<Assessment> => {
  const isFormData = data instanceof FormData;
  const response = await api.post(API_URL, data, isFormData ? { headers: { 'Content-Type': undefined } } : undefined);
  return response.data.data;
};

export const updateAssessment = async (id: string, data: UpdateAssessmentDTO | FormData): Promise<Assessment> => {
  const isFormData = data instanceof FormData;
  const response = await api.put(`${API_URL}/${id}`, data, isFormData ? { headers: { 'Content-Type': undefined } } : undefined);
  return response.data.data;
};

export const deleteAssessment = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};

export interface StartAssessmentResponse {
  requiresSeb: boolean;
  redirectUrl: string;
  submissionId: string;
}

export interface DefaultSebConfigResponse {
  hasDefaultSeb: boolean;
  defaultSebConfigKey: string | null;
  defaultSebConfigFilePath: string | null;
}

export const startAssessment = async (id: string): Promise<StartAssessmentResponse> => {
  const response = await api.post(`${API_URL}/${id}/start`);
  return response.data.data;
};

export const getDefaultSebConfig = async (offeringId?: string): Promise<DefaultSebConfigResponse> => {
  const response = await api.get(`${API_URL}/seb/default-config`, {
    params: offeringId ? { offeringId } : undefined,
  });
  return response.data.data;
};


