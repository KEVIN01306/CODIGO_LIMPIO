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
    updateCodeSnapshotUseCase;
    runCodeUseCase;
    listAssessmentSubmissionsUseCase;
    gradeSubmissionUseCase;
    constructor(startUseCase, syncUseCase, finishUseCase, getUseCase, updateCodeSnapshotUseCase, runCodeUseCase, listAssessmentSubmissionsUseCase, gradeSubmissionUseCase) {
        super();
        this.startUseCase = startUseCase;
        this.syncUseCase = syncUseCase;
        this.finishUseCase = finishUseCase;
        this.getUseCase = getUseCase;
        this.updateCodeSnapshotUseCase = updateCodeSnapshotUseCase;
        this.runCodeUseCase = runCodeUseCase;
        this.listAssessmentSubmissionsUseCase = listAssessmentSubmissionsUseCase;
        this.gradeSubmissionUseCase = gradeSubmissionUseCase;
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
    /**
     * PUT /:id/code
     * Persists the student's latest code snapshot.
     * Validates ownership and editability inside the use case.
     */
    updateCodeSnapshot = async (req, res, next) => {
        try {
            const id = req.params.id;
            const { codeSnapshot } = req.body;
            const user = req.user;
            const entity = await this.updateCodeSnapshotUseCase.execute(id, user.id, codeSnapshot);
            return res.status(200).json(ResponseHttp.success('Code snapshot updated successfully', entity));
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * POST /:id/run
     * Executes the student's current code snapshot.
     * Validates ownership and IN_PROGRESS status in the use case.
     * Runtime errors (exceptions, non-zero exit) are returned in the response
     * body — they are NOT treated as HTTP errors.
     */
    runCode = async (req, res, next) => {
        try {
            const id = req.params.id;
            const { codeSnapshot, entryFile } = req.body;
            const user = req.user;
            const result = await this.runCodeUseCase.execute(id, user.id, codeSnapshot, entryFile);
            return res.status(200).json(ResponseHttp.success('Code executed successfully', result));
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /assessment/:assessmentId
     * Returns all enrolled students for the assessment's offering, with their submission status, scores, and integrity metrics.
     */
    getByAssessment = async (req, res, next) => {
        try {
            const assessmentId = req.params.assessmentId;
            const data = await this.listAssessmentSubmissionsUseCase.execute(assessmentId);
            return res.status(200).json(ResponseHttp.success('Assessment submissions fetched successfully', data));
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * PATCH /:id/grade
     * Updates the submission grade / totalScore and feedback.
     */
    grade = async (req, res, next) => {
        try {
            const id = req.params.id;
            const { totalScore, feedback } = req.body;
            if (totalScore === undefined || totalScore === null || isNaN(Number(totalScore))) {
                throw new AppError('totalScore is required and must be a number', 'BAD_REQUEST', 400);
            }
            const updated = await this.gradeSubmissionUseCase.execute(id, Number(totalScore), feedback);
            return res.status(200).json(ResponseHttp.success('Submission graded successfully', updated));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=submission.controller.js.map