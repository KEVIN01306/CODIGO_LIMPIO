import { z } from "zod";
export declare const CreateStudentSchema: z.ZodObject<{
    email: z.ZodString;
    passwordRaw: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    campusId: z.ZodString;
    studentNumber: z.ZodString;
}, z.core.$strip>;
export declare const UpdateStudentSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    campusId: z.ZodOptional<z.ZodString>;
    studentNumber: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=students.schemas.d.ts.map