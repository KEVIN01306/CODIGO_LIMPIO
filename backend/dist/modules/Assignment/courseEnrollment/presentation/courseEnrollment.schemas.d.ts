import { z } from "zod";
export declare const CreateCourseEnrollmentSchema: z.ZodObject<{
    offeringId: z.ZodString;
    studentId: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<{
        ENROLLED: "ENROLLED";
        DROPPED: "DROPPED";
        FAILED: "FAILED";
        COMPLETED: "COMPLETED";
    }>>;
}, z.core.$strip>;
export declare const UpdateCourseEnrollmentSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        ENROLLED: "ENROLLED";
        DROPPED: "DROPPED";
        FAILED: "FAILED";
        COMPLETED: "COMPLETED";
    }>>;
    finalGrade: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export declare const CourseEnrollmentIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=courseEnrollment.schemas.d.ts.map