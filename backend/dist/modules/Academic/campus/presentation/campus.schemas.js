import { z } from "zod";
export const CreateCampusSchema = z.object({
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
    address: z.string().nullable().optional()
});
export const UpdateCampusSchema = z.object({
    code: z.string().min(1, "Code is required").optional(),
    name: z.string().min(1, "Name is required").optional(),
    address: z.string().nullable().optional(),
    isActive: z.boolean().optional()
});
export const CampusIdSchema = z.object({
    id: z.string().uuid("Invalid campus ID")
});
//# sourceMappingURL=campus.schemas.js.map