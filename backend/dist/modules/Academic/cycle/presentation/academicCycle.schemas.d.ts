import { z } from "zod";
export declare const CreateAcademicCycleSchema: z.ZodObject<{
    campusId: z.ZodString;
    name: z.ZodString;
    year: z.ZodNumber;
    order: z.ZodNumber;
    startDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    endDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    isCurrent: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const UpdateAcademicCycleSchema: z.ZodObject<{
    campusId: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    year: z.ZodOptional<z.ZodNumber>;
    order: z.ZodOptional<z.ZodNumber>;
    startDate: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>;
    endDate: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>;
    isCurrent: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const AcademicCycleIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=academicCycle.schemas.d.ts.map