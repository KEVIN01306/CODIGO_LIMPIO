import ResponseHttp from '../../../../app/http/response.http.js';
import BaseController from '../../../../presentation/base.controller.js';
import AppError from '../../../../shared/errors/AppError.js';
import { PrismaClient } from '@prisma/client';
import { submissionEventBus } from '../infrastructure/submission-events.bus.js';
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
    getStudentSubmissionFeedbackUseCase;
    listStudentSubmissionsUseCase;
    getStudentCourseGradesUseCase;
    constructor(startUseCase, syncUseCase, finishUseCase, getUseCase, updateCodeSnapshotUseCase, runCodeUseCase, listAssessmentSubmissionsUseCase, gradeSubmissionUseCase, getStudentSubmissionFeedbackUseCase, listStudentSubmissionsUseCase, getStudentCourseGradesUseCase) {
        super();
        this.startUseCase = startUseCase;
        this.syncUseCase = syncUseCase;
        this.finishUseCase = finishUseCase;
        this.getUseCase = getUseCase;
        this.updateCodeSnapshotUseCase = updateCodeSnapshotUseCase;
        this.runCodeUseCase = runCodeUseCase;
        this.listAssessmentSubmissionsUseCase = listAssessmentSubmissionsUseCase;
        this.gradeSubmissionUseCase = gradeSubmissionUseCase;
        this.getStudentSubmissionFeedbackUseCase = getStudentSubmissionFeedbackUseCase;
        this.listStudentSubmissionsUseCase = listStudentSubmissionsUseCase;
        this.getStudentCourseGradesUseCase = getStudentCourseGradesUseCase;
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
            const user = req.user;
            const { entryFile, codeSnapshot } = req.body || {};
            const entity = await this.finishUseCase.execute(id, user.id, { entryFile, codeSnapshot });
            return res.status(200).json(ResponseHttp.success('Submission finished and evaluated successfully', entity));
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
            // Notify real-time listeners that the submission has been graded
            try {
                submissionEventBus.publish({
                    type: 'SUBMISSION_GRADED',
                    submissionId: id,
                    totalScore: Number(totalScore),
                    feedback,
                    status: 'EVALUATED',
                    timestamp: new Date().toISOString()
                });
            }
            catch (err) {
                console.warn('Could not broadcast SUBMISSION_GRADED event:', err);
            }
            return res.status(200).json(ResponseHttp.success('Submission graded successfully', updated));
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /my-submissions
     * Returns all submissions belonging to the authenticated student, optionally filtered by offeringId.
     */
    getMySubmissions = async (req, res, next) => {
        try {
            const user = req.user;
            const offeringId = req.query.offeringId;
            const data = await this.listStudentSubmissionsUseCase.execute(user.id, offeringId);
            return res.status(200).json(ResponseHttp.success('Student submissions fetched successfully', data));
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /course/:offeringId/grades
     * Returns authoritative grades across all assessments for the authenticated student in the course offering.
     */
    getMyCourseGrades = async (req, res, next) => {
        try {
            const user = req.user;
            const offeringId = req.params.offeringId;
            const data = await this.getStudentCourseGradesUseCase.execute(user.id, offeringId);
            return res.status(200).json(ResponseHttp.success('Course grades fetched successfully', data));
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /:id/feedback
     * Returns sanitized, student-authorized evaluation feedback for a submission.
     * Strictly verifies student ownership.
     */
    getFeedback = async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = req.user;
            const feedback = await this.getStudentSubmissionFeedbackUseCase.execute(id, user.id);
            return res.status(200).json(ResponseHttp.success('Submission feedback fetched successfully', feedback));
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /assessment/:assessmentId/feedback
     * Returns sanitized feedback for the authenticated student's submission on this assessment.
     */
    getFeedbackByAssessment = async (req, res, next) => {
        try {
            const assessmentId = req.params.assessmentId;
            const user = req.user;
            const feedback = await this.getStudentSubmissionFeedbackUseCase.executeByAssessment(assessmentId, user.id);
            return res.status(200).json(ResponseHttp.success('Submission feedback fetched successfully', feedback));
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /:id/events
     * SSE stream for real-time submission updates (such as AI conversation messages).
     */
    subscribeEvents = async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = req.user;
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
            if (typeof res.flushHeaders === 'function') {
                res.flushHeaders();
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
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=submission.controller.js.map