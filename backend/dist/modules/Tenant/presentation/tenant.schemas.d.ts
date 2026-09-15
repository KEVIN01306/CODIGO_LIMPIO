import { z } from "zod";
export declare const UpdateTenantSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const UpdateSebConfigSchema: z.ZodObject<{
    defaultSebConfigKey: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
}, z.core.$strip>;
//# sourceMappingURL=tenant.schemas.d.ts.map