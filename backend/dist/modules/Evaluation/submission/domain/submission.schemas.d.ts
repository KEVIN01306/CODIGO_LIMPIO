import { z } from 'zod';
export declare const startSubmissionSchema: z.ZodObject<{
    assessmentId: z.ZodString;
}, z.core.$strip>;
export declare const syncSubmissionSchema: z.ZodObject<{
    tabSwitchesCount: z.ZodOptional<z.ZodNumber>;
    clipboardAttempts: z.ZodOptional<z.ZodNumber>;
    codeSnapshot: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
/**
 * Schema for the dedicated code snapshot endpoint.
 * Strictly validates that both file paths and file contents are strings.
 * Prevents the frontend from sending malformed payloads.
 */
export declare const updateCodeSnapshotSchema: z.ZodObject<{
    codeSnapshot: z.ZodRecord<z.ZodString, z.ZodString>;
}, z.core.$strip>;
/**
 * Schema for the code execution endpoint.
 * The frontend sends the full current file map plus the entry-point file path.
 */
export declare const runCodeSchema: z.ZodObject<{
    codeSnapshot: z.ZodRecord<z.ZodString, z.ZodString>;
    entryFile: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=submission.schemas.d.ts.map