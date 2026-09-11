import { z } from "zod";
export const CreateAcademicCycleSchema = z.object({
    campusId: z.string().uuid("Invalid campus ID"),
    name: z.string().min(1, "Name is required"),
    year: z.number().int().min(2000, "Invalid year"),
    order: z.number().int().min(1, "Order must be positive"),
    startDate: z.string().datetime("Invalid start date").transform(val => new Date(val)),
    endDate: z.string().datetime("Invalid end date").transform(val => new Date(val)),
    isCurrent: z.boolean().optional()
});
export const UpdateAcademicCycleSchema = z.object({
    campusId: z.string().uuid("Invalid campus ID").optional(),
    name: z.string().min(1, "Name is required").optional(),
    year: z.number().int().min(2000, "Invalid year").optional(),
    order: z.number().int().min(1, "Order must be positive").optional(),
    startDate: z.string().datetime("Invalid start date").transform(val => new Date(val)).optional(),
    endDate: z.string().datetime("Invalid end date").transform(val => new Date(val)).optional(),
    isCurrent: z.boolean().optional()
});
export const AcademicCycleIdSchema = z.object({
    id: z.string().uuid("Invalid academic cycle ID")
});
//# sourceMappingURL=academicCycle.schemas.js.map