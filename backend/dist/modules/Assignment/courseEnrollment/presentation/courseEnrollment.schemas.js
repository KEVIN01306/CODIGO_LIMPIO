import { z } from "zod";
export const CreateCourseEnrollmentSchema = z.object({
    offeringId: z.string().uuid("Invalid course offering ID"),
    studentId: z.string().uuid("Invalid student ID"),
    status: z.enum(["ENROLLED", "COMPLETED", "DROPPED", "FAILED"]).optional()
});
export const UpdateCourseEnrollmentSchema = z.object({
    status: z.enum(["ENROLLED", "COMPLETED", "DROPPED", "FAILED"]).optional(),
    finalGrade: z.number().min(0).max(100).nullable().optional()
});
export const CourseEnrollmentIdSchema = z.object({
    id: z.string().uuid("Invalid course enrollment ID")
});
//# sourceMappingURL=courseEnrollment.schemas.js.map