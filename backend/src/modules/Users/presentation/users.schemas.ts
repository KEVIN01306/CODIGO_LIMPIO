import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string().email("Invalid email format"),
    passwordRaw: z.string().min(8, "Password must be at least 8 characters long"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required")
});

export const UpdateUserSchema = z.object({
    email: z.string().email("Invalid email format").optional(),
    passwordRaw: z.string().min(8, "Password must be at least 8 characters long").optional(),
    firstName: z.string().min(1, "First name must not be empty").optional(),
    lastName: z.string().min(1, "Last name must not be empty").optional()
});

export const UserIdSchema = z.object({
    id: z.string().uuid("Invalid user ID format")
});
