import api from '../../../core/api/axios.config';
import type { StudentCourseGradesResponse } from '../domain/grades.interfaces';

const API_URL = '/evaluations/submissions';

export const getStudentCourseGrades = async (
  offeringId: string
): Promise<StudentCourseGradesResponse> => {
  const response = await api.get(`${API_URL}/course/${offeringId}/grades`);
  return response.data.data;
};
