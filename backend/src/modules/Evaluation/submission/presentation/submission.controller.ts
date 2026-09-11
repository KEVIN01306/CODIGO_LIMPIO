import type { Request, Response, NextFunction } from 'express';
import ResponseHttp from '../../../../app/http/response.http.js';
import BaseController from '../../../../presentation/base.controller.js';
import type { StartSubmissionUseCase } from '../application/start-submission.usecase.js';
import type { SyncSubmissionUseCase } from '../application/sync-submission.usecase.js';
import type { FinishSubmissionUseCase } from '../application/finish-submission.usecase.js';
import type { GetSubmissionUseCase } from '../application/get-submission.usecase.js';
import AppError from '@shared/errors/AppError.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SubmissionController extends BaseController {
    constructor(
        private readonly startUseCase: StartSubmissionUseCase,
        private readonly syncUseCase: SyncSubmissionUseCase,
        private readonly finishUseCase: FinishSubmissionUseCase,
        private readonly getUseCase: GetSubmissionUseCase
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
}
