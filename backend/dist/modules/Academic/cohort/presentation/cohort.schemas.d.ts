import { z } from "zod";
export declare const CreateCohortSchema: z.ZodObject<{
    campusId: z.ZodString;
    programId: z.ZodString;
    name: z.ZodString;
    startYear: z.ZodNumber;
}, z.core.$strip>;
export declare const UpdateCohortSchema: z.ZodObject<{
    campusId: z.ZodOptional<z.ZodString>;
    programId: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    startYear: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const CohortIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=cohort.schemas.d.ts.map