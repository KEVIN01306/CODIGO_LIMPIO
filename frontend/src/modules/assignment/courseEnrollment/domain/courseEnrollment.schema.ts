import { z } from 'zod';

export const courseEnrollmentSchema = z.object({
  offeringId: z.string().min(1, 'Course Offering is required'),
  studentId: z.string().min(1, 'Student is required'),
  status: z.enum(['ENROLLED', 'COMPLETED', 'DROPPED', 'FAILED']),
  finalGrade: z.number().min(0).max(100).nullable().optional()
});
