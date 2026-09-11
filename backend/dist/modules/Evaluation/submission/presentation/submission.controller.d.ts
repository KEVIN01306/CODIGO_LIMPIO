import type { Request, Response, NextFunction } from 'express';
import BaseController from '../../../../presentation/base.controller.js';
import type { StartSubmissionUseCase } from '../application/start-submission.usecase.js';
import type { SyncSubmissionUseCase } from '../application/sync-submission.usecase.js';
import type { FinishSubmissionUseCase } from '../application/finish-submission.usecase.js';
import type { GetSubmissionUseCase } from '../application/get-submission.usecase.js';
export declare class SubmissionController extends BaseController {
    private readonly startUseCase;
    private readonly syncUseCase;
    private readonly finishUseCase;
    private readonly getUseCase;
    constructor(startUseCase: StartSubmissionUseCase, syncUseCase: SyncSubmissionUseCase, finishUseCase: FinishSubmissionUseCase, getUseCase: GetSubmissionUseCase);
    start: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    sync: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    finish: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=submission.controller.d.ts.map