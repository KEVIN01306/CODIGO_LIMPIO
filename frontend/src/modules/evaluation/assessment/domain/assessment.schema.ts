import { z } from 'zod';

export const assessmentSchema = z.object({
  offeringId: z.string().min(1, 'Course offering is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['QUIZ', 'EXAM', 'PROJECT', 'HOMEWORK', 'AI_INTERVIEW']),
  maxScore: z.coerce.number().min(0, 'Score cannot be negative'),
  weight: z.coerce.number().min(0).max(100).optional(),
  dueDate: z.string().optional(),
  timeLimitMinutes: z.coerce.number().min(1).optional(),
  allowedLanguage: z.string().optional(),
  strictMode: z.boolean().optional()
});
