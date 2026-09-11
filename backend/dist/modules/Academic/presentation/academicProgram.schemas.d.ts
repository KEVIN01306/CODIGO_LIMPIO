import { z } from "zod";
export declare const CreateAcademicProgramSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export declare const UpdateAcademicProgramSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const AcademicProgramIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=academicProgram.schemas.d.ts.map