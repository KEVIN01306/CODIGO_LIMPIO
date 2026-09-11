import { z } from "zod";
export const CreateTeacherSchema = z.object({
    email: z.string().email("Formato de email inválido"),
    passwordRaw: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    campusId: z.string().uuid("Formato de campusId inválido"),
    employeeCode: z.string().optional()
});
export const UpdateTeacherSchema = z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    campusId: z.string().uuid().optional(),
    employeeCode: z.string().optional()
});
//# sourceMappingURL=teachers.schemas.js.map