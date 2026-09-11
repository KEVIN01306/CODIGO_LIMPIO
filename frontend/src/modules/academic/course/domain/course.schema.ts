import { z } from 'zod';

export const courseSchema = z.object({
  programId: z.string().min(1, 'Program is required'),
  code: z.string().min(1, 'Code is required').max(50, 'Code is too long'),
  name: z.string().min(1, 'Name is required').max(150, 'Name is too long'),
  description: z.string().optional(),
  credits: z.number().int().min(0, 'Credits must be a positive number'),
  isActive: z.boolean().optional(),
});
