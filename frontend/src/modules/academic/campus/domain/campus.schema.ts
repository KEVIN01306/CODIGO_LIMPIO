import { z } from 'zod';

export const campusSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code is too long'),
  name: z.string().min(1, 'Name is required').max(150, 'Name is too long'),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
});
