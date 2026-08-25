import type { NextFunction, Request, Response } from "express";
import { type ZodTypeAny } from "zod";
export declare class ValidatedMiddleware {
    validateBody(schema: ZodTypeAny): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    validateQuery(schema: ZodTypeAny): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    validateParams(schema: ZodTypeAny): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=Validated.middleware.d.ts.map