import { z } from 'zod';

export const academicProgramSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code is too long'),
  name: z.string().min(1, 'Name is required').max(150, 'Name is too long'),
});
