import { z } from 'zod';

export const courseOfferingSchema = z.object({
  campusId: z.string().min(1, 'Campus is required'),
  courseId: z.string().min(1, 'Course is required'),
  cycleId: z.string().min(1, 'Cycle is required'),
  teacherId: z.string().optional().nullable(),
  section: z.string().min(1, 'Section is required').max(10, 'Section is too long')
});
