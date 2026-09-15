import { z } from "zod";
export const UpdateTenantSchema = z.object({
    name: z.string().trim().min(1, "Name cannot be empty").max(100, "Name cannot exceed 100 characters").optional(),
    slug: z.string().trim().min(1, "Slug cannot be empty").max(50, "Slug cannot exceed 50 characters")
        .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
        .optional(),
    isActive: z.boolean().optional()
});
export const UpdateSebConfigSchema = z.object({
    defaultSebConfigKey: z.string().trim().nullable().optional()
        .transform(val => (val === "" || val === undefined) ? null : val)
});
//# sourceMappingURL=tenant.schemas.js.map