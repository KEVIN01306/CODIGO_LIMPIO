import { z } from 'zod';
export declare const chatMessageSchema: z.ZodObject<{
    role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
    }>;
    content: z.ZodString;
}, z.core.$strip>;
export declare const workspaceContextSchema: z.ZodObject<{
    currentCode: z.ZodDefault<z.ZodString>;
    language: z.ZodString;
    lastExecutionOutput: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    exerciseGoal: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const aiChatSchema: z.ZodObject<{
    studentPrompt: z.ZodString;
    chatHistory: z.ZodDefault<z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
        }>;
        content: z.ZodString;
    }, z.core.$strip>>>;
    workspaceContext: z.ZodObject<{
        currentCode: z.ZodDefault<z.ZodString>;
        language: z.ZodString;
        lastExecutionOutput: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        exerciseGoal: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=ai.schemas.d.ts.map