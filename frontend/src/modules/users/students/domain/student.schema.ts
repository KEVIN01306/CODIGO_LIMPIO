import { z } from 'zod';

export const studentCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  passwordRaw: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  campusId: z.string().min(1, 'Campus is required'),
  studentNumber: z.string().min(1, 'Student number is required')
});

export const studentUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name is required').optional(),
  lastName: z.string().min(2, 'Last name is required').optional(),
  campusId: z.string().min(1, 'Campus is required').optional(),
  studentNumber: z.string().min(1, 'Student number is required').optional()
});
