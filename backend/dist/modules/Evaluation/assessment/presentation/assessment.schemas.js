import { z } from "zod";
const booleanCoerce = z.preprocess((val) => {
    if (val === "true" || val === true)
        return true;
    if (val === "false" || val === false)
        return false;
    if (val === "" || val === undefined || val === null)
        return undefined;
    return val;
}, z.boolean().optional());
const numberCoerce = (min, max) => z.preprocess((val) => {
    if (val === "" || val === undefined || val === null)
        return undefined;
    return Number(val);
}, z.number().min(min ?? -Infinity).max(max ?? Infinity).optional());
export const createAssessmentSchema = z.object({
    offeringId: z.string().uuid("Invalid course offering ID"),
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().optional(),
    type: z.enum(['QUIZ', 'EXAM', 'PROJECT', 'HOMEWORK', 'AI_INTERVIEW']),
    maxScore: z.preprocess((val) => Number(val), z.number().min(0, "Score cannot be negative")),
    weight: numberCoerce(0, 100),
    dueDate: z.preprocess((val) => (val === "" || val === undefined ? undefined : val), z.string().datetime().optional().or(z.date().optional())),
    timeLimitMinutes: numberCoerce(1),
    allowedLanguage: z.string().optional(),
    strictMode: booleanCoerce,
    requireSeb: booleanCoerce,
    sebConfigKey: z.string().trim().nullable().optional(),
    sebConfigFile: z.any().optional()
});
export const updateAssessmentSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100).optional(),
    description: z.string().optional(),
    type: z.enum(['QUIZ', 'EXAM', 'PROJECT', 'HOMEWORK', 'AI_INTERVIEW']).optional(),
    maxScore: z.preprocess((val) => val !== undefined && val !== "" ? Number(val) : undefined, z.number().min(0, "Score cannot be negative").optional()),
    weight: numberCoerce(0, 100),
    dueDate: z.preprocess((val) => (val === "" || val === undefined ? undefined : val), z.string().datetime().optional().or(z.date().optional())),
    timeLimitMinutes: numberCoerce(1),
    allowedLanguage: z.string().optional(),
    strictMode: booleanCoerce,
    requireSeb: booleanCoerce,
    sebConfigKey: z.string().trim().nullable().optional(),
    sebConfigFile: z.any().optional()
});
//# sourceMappingURL=assessment.schemas.js.map