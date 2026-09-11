import { z } from "zod";
export declare const CreateCourseSchema: z.ZodObject<{
    programId: z.ZodString;
    code: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    credits: z.ZodNumber;
}, z.core.$strip>;
export declare const UpdateCourseSchema: z.ZodObject<{
    programId: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    credits: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const CourseIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=course.schemas.d.ts.map