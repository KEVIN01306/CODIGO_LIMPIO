import { z } from "zod";
export const CreateCourseSchema = z.object({
    programId: z.string().uuid("Invalid program ID"),
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().nullable().optional(),
    credits: z.number().int().min(0, "Credits must be a positive number")
});
export const UpdateCourseSchema = z.object({
    programId: z.string().uuid("Invalid program ID").optional(),
    code: z.string().min(1, "Code is required").optional(),
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().nullable().optional(),
    credits: z.number().int().min(0, "Credits must be a positive number").optional(),
    isActive: z.boolean().optional()
});
export const CourseIdSchema = z.object({
    id: z.string().uuid("Invalid course ID")
});
//# sourceMappingURL=course.schemas.js.map