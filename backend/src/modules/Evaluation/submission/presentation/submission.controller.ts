import type { Request, Response, NextFunction } from 'express';
import ResponseHttp from '../../../../app/http/response.http.js';
import BaseController from '../../../../presentation/base.controller.js';
import type { StartSubmissionUseCase } from '../application/start-submission.usecase.js';
import type { SyncSubmissionUseCase } from '../application/sync-submission.usecase.js';
import type { FinishSubmissionUseCase } from '../application/finish-submission.usecase.js';
import type { GetSubmissionUseCase } from '../application/get-submission.usecase.js';
import type { UpdateCodeSnapshotUseCase } from '../application/update-code-snapshot.usecase.js';
import type { RunCodeUseCase } from '../application/run-code.usecase.js';
import type { ListAssessmentSubmissionsUseCase } from '../application/list-assessment-submissions.usecase.js';
import type { GradeSubmissionUseCase } from '../application/grade-submission.usecase.js';
import AppError from '@shared/errors/AppError.js';
import { PrismaClient } from '@prisma/client';
import { submissionEventBus } from '../infrastructure/submission-events.bus.js';

const prisma = new PrismaClient();

export class SubmissionController extends BaseController {
    constructor(
        private readonly startUseCase: StartSubmissionUseCase,
        private readonly syncUseCase: SyncSubmissionUseCase,
        private readonly finishUseCase: FinishSubmissionUseCase,
        private readonly getUseCase: GetSubmissionUseCase,
        private readonly updateCodeSnapshotUseCase: UpdateCodeSnapshotUseCase,
        private readonly runCodeUseCase: RunCodeUseCase,
        private readonly listAssessmentSubmissionsUseCase: ListAssessmentSubmissionsUseCase,
        private readonly gradeSubmissionUseCase: GradeSubmissionUseCase
    ) { super(); }

    start = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            
            const studentProfile = await prisma.studentProfile.findUnique({
                where: { userId: user.id }
            });
            
            if (!studentProfile) throw new AppError('User is not a student', 'FORBIDDEN', 403);
            const studentId = studentProfile.id;

            const { assessmentId } = req.body;
            const entity = await this.startUseCase.execute(assessmentId, studentId);
            return res.status(200).json(ResponseHttp.success('Submission started successfully', entity));
        } catch (error) { next(error); }
    }

    sync = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = req.body;
            const entity = await this.syncUseCase.execute(id, data);
            return res.status(200).json(ResponseHttp.success('Submission synced successfully', entity));
        } catch (error) { next(error); }
    }

    finish = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const entity = await this.finishUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success('Submission finished successfully', entity));
        } catch (error) { next(error); }
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const entity = await this.getUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success('Submission fetched successfully', entity));
        } catch (error) { next(error); }
    }

    /**
     * PUT /:id/code
     * Persists the student's latest code snapshot.
     * Validates ownership and editability inside the use case.
     */
    updateCodeSnapshot = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const { codeSnapshot } = req.body;
            const user = (req as any).user;
            const entity = await this.updateCodeSnapshotUseCase.execute(id, user.id, codeSnapshot);
            return res.status(200).json(ResponseHttp.success('Code snapshot updated successfully', entity));
        } catch (error) { next(error); }
    }

    /**
     * POST /:id/run
     * Executes the student's current code snapshot.
     * Validates ownership and IN_PROGRESS status in the use case.
     * Runtime errors (exceptions, non-zero exit) are returned in the response
     * body — they are NOT treated as HTTP errors.
     */
    runCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const { codeSnapshot, entryFile } = req.body;
            const user = (req as any).user;
            const result = await this.runCodeUseCase.execute(id, user.id, codeSnapshot, entryFile);
            return res.status(200).json(ResponseHttp.success('Code executed successfully', result));
        } catch (error) { next(error); }
    }

    /**
     * GET /assessment/:assessmentId
     * Returns all enrolled students for the assessment's offering, with their submission status, scores, and integrity metrics.
     */
    getByAssessment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const assessmentId = req.params.assessmentId as string;
            const data = await this.listAssessmentSubmissionsUseCase.execute(assessmentId);
            return res.status(200).json(ResponseHttp.success('Assessment submissions fetched successfully', data));
        } catch (error) { next(error); }
    }

    /**
     * PATCH /:id/grade
     * Updates the submission grade / totalScore and feedback.
     */
    grade = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const { totalScore, feedback } = req.body;
            if (totalScore === undefined || totalScore === null || isNaN(Number(totalScore))) {
                throw new AppError('totalScore is required and must be a number', 'BAD_REQUEST', 400);
            }
            const updated = await this.gradeSubmissionUseCase.execute(id, Number(totalScore), feedback);
            return res.status(200).json(ResponseHttp.success('Submission graded successfully', updated));
        } catch (error) { next(error); }
    }

    /**
     * GET /:id/events
     * SSE stream for real-time submission updates (such as AI conversation messages).
     */
    subscribeEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const user = (req as any).user;

            const submission = await prisma.submission.findUnique({
                where: { id },
                include: { assessment: true }
            });

            if (!submission) {
                throw new AppError('Submission not found', 'NOT_FOUND', 404);
            }

            // Verify access: student owner OR user with assessments:read permission
            const studentProfile = await prisma.studentProfile.findUnique({
                where: { userId: user.id }
            });

            const isStudentOwner = studentProfile && submission.studentId === studentProfile.id;
            const hasTeacherPermission = user.permissions && user.permissions.includes('assessments:read');

            if (!isStudentOwner && !hasTeacherPermission) {
                throw new AppError('Not authorized to observe this submission', 'FORBIDDEN', 403);
            }

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            if (typeof (res as any).flushHeaders === 'function') {
                (res as any).flushHeaders();
            }

            // Send initial connected state with current authoritative chatHistory
            res.write(`data: ${JSON.stringify({
                type: 'CONNECTED',
                submissionId: id,
                chatHistory: submission.chatHistory || []
            })}\n\n`);

            const unsubscribe = submissionEventBus.subscribe(id, (event) => {
                if (!res.writableEnded) {
                    res.write(`data: ${JSON.stringify(event)}\n\n`);
                }
            });

            const keepAliveInterval = setInterval(() => {
                if (!res.writableEnded) {
                    res.write(': keepalive\n\n');
                }
            }, 25000);

            req.on('close', () => {
                clearInterval(keepAliveInterval);
                unsubscribe();
            });
        } catch (error) {
            next(error);
        }
    }
}
