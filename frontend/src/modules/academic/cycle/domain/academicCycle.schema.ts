import { z } from 'zod';

export const academicCycleSchema = z.object({
  campusId: z.string().min(1, 'Campus is required'),
  name: z.string().min(1, 'Name is required').max(150, 'Name is too long'),
  year: z.number().min(2000, 'Invalid year').max(2100, 'Invalid year'),
  order: z.number().min(1, 'Order must be positive'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isCurrent: z.boolean().optional().default(false),
}).refine(data => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End date must be after start date',
  path: ['endDate']
});
