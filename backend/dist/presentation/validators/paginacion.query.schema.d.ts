import { z } from "zod";
export declare const paginacionQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
//# sourceMappingURL=paginacion.query.schema.d.ts.map