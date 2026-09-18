import { z } from 'zod';

export const tenantInformationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tenant name is required')
    .max(100, 'Tenant name cannot exceed 100 characters'),
  slug: z
    .string()
    .trim()
    .min(1, 'Tenant slug is required')
    .max(50, 'Tenant slug cannot exceed 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase alphanumeric characters and hyphens (e.g. mi-universidad)'),
  isActive: z.boolean(),
});

export const sebConfigurationSchema = z.object({
  defaultSebConfigKey: z
    .string()
    .trim()
    .max(255, 'SEB configuration key cannot exceed 255 characters'),
  sebConfigFile: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true;
      if (file instanceof File) {
        return file.name.toLowerCase().endsWith('.seb');
      }
      return true;
    }, 'Only .seb files are allowed.'),
});
