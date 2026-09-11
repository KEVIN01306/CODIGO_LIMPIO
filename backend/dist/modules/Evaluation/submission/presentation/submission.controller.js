import ResponseHttp from '../../../../app/http/response.http.js';
import BaseController from '../../../../presentation/base.controller.js';
import AppError from '../../../../shared/errors/AppError.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class SubmissionController extends BaseController {
    startUseCase;
    syncUseCase;
    finishUseCase;
    getUseCase;
    constructor(startUseCase, syncUseCase, finishUseCase, getUseCase) {
        super();
        this.startUseCase = startUseCase;
        this.syncUseCase = syncUseCase;
        this.finishUseCase = finishUseCase;
        this.getUseCase = getUseCase;
    }
    start = async (req, res, next) => {
        try {
            const user = req.user;
            const studentProfile = await prisma.studentProfile.findUnique({
                where: { userId: user.id }
            });
            if (!studentProfile)
                throw new AppError('User is not a student', 'FORBIDDEN', 403);
            const studentId = studentProfile.id;
            const { assessmentId } = req.body;
            const entity = await this.startUseCase.execute(assessmentId, studentId);
            return res.status(200).json(ResponseHttp.success('Submission started successfully', entity));
        }
        catch (error) {
            next(error);
        }
    };
    sync = async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const entity = await this.syncUseCase.execute(id, data);
            return res.status(200).json(ResponseHttp.success('Submission synced successfully', entity));
        }
        catch (error) {
            next(error);
        }
    };
    finish = async (req, res, next) => {
        try {
            const id = req.params.id;
            const entity = await this.finishUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success('Submission finished successfully', entity));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const entity = await this.getUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success('Submission fetched successfully', entity));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=submission.controller.js.map