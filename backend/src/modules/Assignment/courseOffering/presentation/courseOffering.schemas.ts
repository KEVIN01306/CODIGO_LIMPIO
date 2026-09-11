import { z } from "zod";

export const CreateCourseOfferingSchema = z.object({
    campusId: z.string().uuid("Invalid campus ID"),
    courseId: z.string().uuid("Invalid course ID"),
    cycleId: z.string().uuid("Invalid cycle ID"),
    teacherId: z.string().uuid("Invalid teacher ID").nullable().optional(),
    section: z.string().min(1, "Section is required")
});

export const UpdateCourseOfferingSchema = z.object({
    campusId: z.string().uuid("Invalid campus ID").optional(),
    courseId: z.string().uuid("Invalid course ID").optional(),
    cycleId: z.string().uuid("Invalid cycle ID").optional(),
    teacherId: z.string().uuid("Invalid teacher ID").nullable().optional(),
    section: z.string().min(1, "Section is required").optional()
});

export const CourseOfferingIdSchema = z.object({
    id: z.string().uuid("Invalid course offering ID")
});
