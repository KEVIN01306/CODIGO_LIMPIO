import { z } from "zod";
export const CreateStudentSchema = z.object({
    email: z.string().email("Formato de email inválido"),
    passwordRaw: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    campusId: z.string().uuid("Formato de campusId inválido"),
    studentNumber: z.string().min(1, "El carné o número de estudiante es obligatorio")
});
export const UpdateStudentSchema = z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    campusId: z.string().uuid().optional(),
    studentNumber: z.string().optional()
});
//# sourceMappingURL=students.schemas.js.map