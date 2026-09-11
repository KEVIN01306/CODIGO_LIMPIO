import { z } from "zod";

export const CreateCohortSchema = z.object({
    campusId: z.string().uuid("Invalid campus ID"),
    programId: z.string().uuid("Invalid program ID"),
    name: z.string().min(1, "Name is required"),
    startYear: z.number().int().min(1900, "Invalid start year")
});

export const UpdateCohortSchema = z.object({
    campusId: z.string().uuid("Invalid campus ID").optional(),
    programId: z.string().uuid("Invalid program ID").optional(),
    name: z.string().min(1, "Name is required").optional(),
    startYear: z.number().int().min(1900, "Invalid start year").optional()
});

export const CohortIdSchema = z.object({
    id: z.string().uuid("Invalid cohort ID")
});
