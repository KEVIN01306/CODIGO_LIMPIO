import { z } from 'zod';

export const cohortSchema = z.object({
  campusId: z.string().min(1, 'Campus is required'),
  programId: z.string().min(1, 'Program is required'),
  name: z.string().min(1, 'Name is required').max(150, 'Name is too long'),
  startYear: z.number().int().min(1900, 'Invalid start year'),
});
