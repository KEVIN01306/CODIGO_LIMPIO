import { z } from 'zod';
export const chatMessageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
});
export const workspaceContextSchema = z.object({
    currentCode: z.string().default(''),
    language: z.string().min(1, 'Language is required'),
    lastExecutionOutput: z.string().nullable().optional(),
    exerciseGoal: z.string().optional().default(''),
});
export const aiChatSchema = z.object({
    studentPrompt: z.string().min(1, 'studentPrompt cannot be empty'),
    chatHistory: z.array(chatMessageSchema).default([]),
    workspaceContext: workspaceContextSchema,
});
//# sourceMappingURL=ai.schemas.js.map