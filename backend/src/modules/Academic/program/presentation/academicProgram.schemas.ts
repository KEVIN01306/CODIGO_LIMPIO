import { z } from "zod";

export const CreateAcademicProgramSchema = z.object({
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required")
});

export const UpdateAcademicProgramSchema = z.object({
    code: z.string().min(1, "Code is required").optional(),
    name: z.string().min(1, "Name is required").optional()
});

export const AcademicProgramIdSchema = z.object({
    id: z.string().uuid("Invalid academic program ID")
});
