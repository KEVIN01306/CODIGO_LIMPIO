import { z } from "zod";
export const createAssessmentSchema = z.object({
    offeringId: z.string().uuid("Invalid course offering ID"),
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().optional(),
    type: z.enum(['QUIZ', 'EXAM', 'PROJECT', 'HOMEWORK', 'AI_INTERVIEW']),
    maxScore: z.number().min(0, "Score cannot be negative"),
    weight: z.number().min(0).max(100).optional(),
    dueDate: z.string().datetime().optional().or(z.date().optional()),
    timeLimitMinutes: z.number().min(1).optional(),
    allowedLanguage: z.string().optional(),
    strictMode: z.boolean().optional()
});
export const updateAssessmentSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100).optional(),
    description: z.string().optional(),
    type: z.enum(['QUIZ', 'EXAM', 'PROJECT', 'HOMEWORK', 'AI_INTERVIEW']).optional(),
    maxScore: z.number().min(0, "Score cannot be negative").optional(),
    weight: z.number().min(0).max(100).optional(),
    dueDate: z.string().datetime().optional().or(z.date().optional()),
    timeLimitMinutes: z.number().min(1).optional(),
    allowedLanguage: z.string().optional(),
    strictMode: z.boolean().optional()
});
//# sourceMappingURL=assessment.schemas.js.map