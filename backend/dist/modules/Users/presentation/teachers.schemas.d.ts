import { z } from "zod";
export declare const CreateTeacherSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    campusId: z.ZodString;
    employeeCode: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdateTeacherSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    campusId: z.ZodOptional<z.ZodString>;
    employeeCode: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=teachers.schemas.d.ts.map