import { z } from 'zod';

export const startSubmissionSchema = z.object({
    assessmentId: z.string().min(1, 'Assessment ID is required')
});

export const syncSubmissionSchema = z.object({
    tabSwitchesCount: z.number().int().min(0).optional(),
    clipboardAttempts: z.number().int().min(0).optional(),
    codeSnapshot: z.any().optional()
});
