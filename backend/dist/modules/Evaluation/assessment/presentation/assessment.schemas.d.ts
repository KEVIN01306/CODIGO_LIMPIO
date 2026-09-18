import { z } from "zod";
export declare const createAssessmentSchema: z.ZodObject<{
    offeringId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        QUIZ: "QUIZ";
        EXAM: "EXAM";
        PROJECT: "PROJECT";
        HOMEWORK: "HOMEWORK";
        AI_INTERVIEW: "AI_INTERVIEW";
    }>;
    maxScore: z.ZodPreprocess<z.ZodNumber>;
    weight: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    dueDate: z.ZodPreprocess<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>>;
    timeLimitMinutes: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    allowedLanguage: z.ZodOptional<z.ZodString>;
    strictMode: z.ZodPreprocess<z.ZodOptional<z.ZodBoolean>>;
    requireSeb: z.ZodPreprocess<z.ZodOptional<z.ZodBoolean>>;
    sebConfigKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sebConfigFile: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
export declare const updateAssessmentSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        QUIZ: "QUIZ";
        EXAM: "EXAM";
        PROJECT: "PROJECT";
        HOMEWORK: "HOMEWORK";
        AI_INTERVIEW: "AI_INTERVIEW";
    }>>;
    maxScore: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    weight: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    dueDate: z.ZodPreprocess<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>>;
    timeLimitMinutes: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>>;
    allowedLanguage: z.ZodOptional<z.ZodString>;
    strictMode: z.ZodPreprocess<z.ZodOptional<z.ZodBoolean>>;
    requireSeb: z.ZodPreprocess<z.ZodOptional<z.ZodBoolean>>;
    sebConfigKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sebConfigFile: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
//# sourceMappingURL=assessment.schemas.d.ts.map