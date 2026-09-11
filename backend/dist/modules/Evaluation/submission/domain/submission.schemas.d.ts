import { z } from 'zod';
export declare const startSubmissionSchema: z.ZodObject<{
    assessmentId: z.ZodString;
}, z.core.$strip>;
export declare const syncSubmissionSchema: z.ZodObject<{
    tabSwitchesCount: z.ZodOptional<z.ZodNumber>;
    clipboardAttempts: z.ZodOptional<z.ZodNumber>;
    codeSnapshot: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
//# sourceMappingURL=submission.schemas.d.ts.map