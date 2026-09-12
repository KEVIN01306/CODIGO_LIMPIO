import type { Request, Response, NextFunction } from 'express';
import BaseController from '../../../../presentation/base.controller.js';
import type { StartSubmissionUseCase } from '../application/start-submission.usecase.js';
import type { SyncSubmissionUseCase } from '../application/sync-submission.usecase.js';
import type { FinishSubmissionUseCase } from '../application/finish-submission.usecase.js';
import type { GetSubmissionUseCase } from '../application/get-submission.usecase.js';
import type { UpdateCodeSnapshotUseCase } from '../application/update-code-snapshot.usecase.js';
import type { RunCodeUseCase } from '../application/run-code.usecase.js';
import type { ListAssessmentSubmissionsUseCase } from '../application/list-assessment-submissions.usecase.js';
import type { GradeSubmissionUseCase } from '../application/grade-submission.usecase.js';
export declare class SubmissionController extends BaseController {
    private readonly startUseCase;
    private readonly syncUseCase;
    private readonly finishUseCase;
    private readonly getUseCase;
    private readonly updateCodeSnapshotUseCase;
    private readonly runCodeUseCase;
    private readonly listAssessmentSubmissionsUseCase;
    private readonly gradeSubmissionUseCase;
    constructor(startUseCase: StartSubmissionUseCase, syncUseCase: SyncSubmissionUseCase, finishUseCase: FinishSubmissionUseCase, getUseCase: GetSubmissionUseCase, updateCodeSnapshotUseCase: UpdateCodeSnapshotUseCase, runCodeUseCase: RunCodeUseCase, listAssessmentSubmissionsUseCase: ListAssessmentSubmissionsUseCase, gradeSubmissionUseCase: GradeSubmissionUseCase);
    start: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    sync: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    finish: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PUT /:id/code
     * Persists the student's latest code snapshot.
     * Validates ownership and editability inside the use case.
     */
    updateCodeSnapshot: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /:id/run
     * Executes the student's current code snapshot.
     * Validates ownership and IN_PROGRESS status in the use case.
     * Runtime errors (exceptions, non-zero exit) are returned in the response
     * body — they are NOT treated as HTTP errors.
     */
    runCode: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * GET /assessment/:assessmentId
     * Returns all enrolled students for the assessment's offering, with their submission status, scores, and integrity metrics.
     */
    getByAssessment: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * PATCH /:id/grade
     * Updates the submission grade / totalScore and feedback.
     */
    grade: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=submission.controller.d.ts.map