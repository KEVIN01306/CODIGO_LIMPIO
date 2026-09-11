import { z } from "zod";
export declare const CreateCourseOfferingSchema: z.ZodObject<{
    campusId: z.ZodString;
    courseId: z.ZodString;
    cycleId: z.ZodString;
    teacherId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    section: z.ZodString;
}, z.core.$strip>;
export declare const UpdateCourseOfferingSchema: z.ZodObject<{
    campusId: z.ZodOptional<z.ZodString>;
    courseId: z.ZodOptional<z.ZodString>;
    cycleId: z.ZodOptional<z.ZodString>;
    teacherId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    section: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const CourseOfferingIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=courseOffering.schemas.d.ts.map