import { z } from 'zod';

export const createAssessmentSchema = (tenantHasDefaultSeb: boolean = false) =>
  z
    .object({
      offeringId: z.string().min(1, 'Course offering is required'),
      title: z.string().min(3, 'Title must be at least 3 characters'),
      description: z.string().optional(),
      type: z.enum(['QUIZ', 'EXAM', 'PROJECT', 'HOMEWORK', 'AI_INTERVIEW']),
      maxScore: z.coerce.number().min(0, 'Score cannot be negative'),
      weight: z.coerce.number().min(0).max(100).optional(),
      dueDate: z.string().optional(),
      timeLimitMinutes: z.coerce.number().min(1).optional(),
      allowedLanguage: z.string().optional(),
      strictMode: z.boolean().optional(),
      requireSeb: z.boolean().optional(),
      sebConfigKey: z.string().optional(),
      sebConfigFile: z.any().optional(),
      sebConfigFilePath: z.string().nullable().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.strictMode) {
        const hasKey = Boolean(data.sebConfigKey && data.sebConfigKey.trim() !== '');
        const hasExistingFile = Boolean(data.sebConfigFilePath);
        const hasNewFile = Boolean(data.sebConfigFile);
        const hasFile = hasExistingFile || hasNewFile;

        // If tenant has default SEB configuration, custom SEB key & file are optional
        if (tenantHasDefaultSeb && !hasKey && !hasNewFile) {
          return;
        }

        if (!hasKey) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['sebConfigKey'],
            message: 'SEB key is required when strict mode is enabled',
          });
        }

        if (!hasFile) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['sebConfigFile'],
            message: 'SEB configuration file (.seb) is required when strict mode is enabled',
          });
        }

        if (data.sebConfigFile instanceof File) {
          if (!data.sebConfigFile.name.toLowerCase().endsWith('.seb')) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['sebConfigFile'],
              message: 'Only .seb files are allowed.',
            });
          }
        }
      }
    });

export const assessmentSchema = createAssessmentSchema(false);

