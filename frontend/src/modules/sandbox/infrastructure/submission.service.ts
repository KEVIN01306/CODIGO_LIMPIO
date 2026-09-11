import api from "../../../core/api/axios.config";

const API_URL = '/evaluations/submissions';

export const startSubmission = async (assessmentId: string): Promise<any> => {
  const response = await api.post(`${API_URL}/start`, { assessmentId });
  return response.data.data;
};

export const syncSubmission = async (
  id: string,
  data: { tabSwitchesCount?: number; clipboardAttempts?: number; codeSnapshot?: any }
): Promise<any> => {
  const response = await api.patch(`${API_URL}/${id}/sync`, data);
  return response.data.data;
};

export const finishSubmission = async (id: string): Promise<any> => {
  const response = await api.post(`${API_URL}/${id}/finish`);
  return response.data.data;
};

export const getSubmissionById = async (id: string): Promise<any> => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data.data;
};
