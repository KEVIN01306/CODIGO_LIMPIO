import { z } from 'zod';

export const startSubmissionSchema = z.object({
    assessmentId: z.string().min(1, 'Assessment ID is required')
});

export const syncSubmissionSchema = z.object({
    tabSwitchesCount: z.number().int().min(0).optional(),
    clipboardAttempts: z.number().int().min(0).optional(),
    codeSnapshot: z.any().optional()
});

/**
 * Schema for the dedicated code snapshot endpoint.
 * Strictly validates that both file paths and file contents are strings.
 * Prevents the frontend from sending malformed payloads.
 */
export const updateCodeSnapshotSchema = z.object({
    codeSnapshot: z.record(z.string(), z.string())
        .refine((val) => Object.keys(val).length > 0, {
            message: 'codeSnapshot must contain at least one file'
        })
});

/**
 * Schema for the code execution endpoint.
 * The frontend sends the full current file map plus the entry-point file path.
 */
export const runCodeSchema = z.object({
    codeSnapshot: z.record(z.string(), z.string())
        .refine((val) => Object.keys(val).length > 0, {
            message: 'codeSnapshot must contain at least one file'
        }),
    entryFile: z.string().min(1, 'entryFile is required')
});
