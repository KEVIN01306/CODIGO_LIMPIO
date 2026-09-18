import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaSubmissionRepository } from '../infrastructure/prisma-submission.repository.js';
import { StartSubmissionUseCase } from '../application/start-submission.usecase.js';
import { SyncSubmissionUseCase } from '../application/sync-submission.usecase.js';
import { FinishSubmissionUseCase } from '../application/finish-submission.usecase.js';
import { GetSubmissionUseCase } from '../application/get-submission.usecase.js';
import { UpdateCodeSnapshotUseCase } from '../application/update-code-snapshot.usecase.js';
import { RunCodeUseCase } from '../application/run-code.usecase.js';
import { ListAssessmentSubmissionsUseCase } from '../application/list-assessment-submissions.usecase.js';
import { GradeSubmissionUseCase } from '../application/grade-submission.usecase.js';
import { GetStudentSubmissionFeedbackUseCase } from '../application/get-student-submission-feedback.usecase.js';
import { ListStudentSubmissionsUseCase } from '../application/list-student-submissions.usecase.js';
import { GetStudentCourseGradesUseCase } from '../application/get-student-course-grades.usecase.js';
import { GeminiAiService } from '../../../AI/infrastructure/gemini-ai.service.js';
import { GradeAssessmentUseCase } from '../../../AI/application/grade-assessment.usecase.js';
import { SubmissionController } from './submission.controller.js';
import { startSubmissionSchema, syncSubmissionSchema, updateCodeSnapshotSchema, runCodeSchema } from '../domain/submission.schemas.js';
import { AuthMiddleware } from '../../../../app/middleware/Auth.middleware.js';
import { ValidatedMiddleware } from '../../../../app/middleware/Validated.middleware.js';

export const submissionRoutes = Router();
const prisma = new PrismaClient();

const repository = new PrismaSubmissionRepository(prisma);
const geminiAiService = new GeminiAiService();
const gradeAssessmentUseCase = new GradeAssessmentUseCase(geminiAiService);
const runCodeUseCase = new RunCodeUseCase(repository);
const finishUseCase = new FinishSubmissionUseCase(repository, runCodeUseCase, gradeAssessmentUseCase, prisma);
const startUseCase = new StartSubmissionUseCase(repository);
const syncUseCase = new SyncSubmissionUseCase(repository);
const getUseCase = new GetSubmissionUseCase(repository);
const updateCodeSnapshotUseCase = new UpdateCodeSnapshotUseCase(repository);
const listAssessmentSubmissionsUseCase = new ListAssessmentSubmissionsUseCase(repository, prisma);
const gradeSubmissionUseCase = new GradeSubmissionUseCase(repository);
const getStudentSubmissionFeedbackUseCase = new GetStudentSubmissionFeedbackUseCase(repository);
const listStudentSubmissionsUseCase = new ListStudentSubmissionsUseCase(repository);
const getStudentCourseGradesUseCase = new GetStudentCourseGradesUseCase(repository);

const controller = new SubmissionController(
    startUseCase,
    syncUseCase,
    finishUseCase,
    getUseCase,
    updateCodeSnapshotUseCase,
    runCodeUseCase,
    listAssessmentSubmissionsUseCase,
    gradeSubmissionUseCase,
    getStudentSubmissionFeedbackUseCase,
    listStudentSubmissionsUseCase,
    getStudentCourseGradesUseCase,
    repository
);

const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();

// Middleware de autenticación global para este módulo
submissionRoutes.use(authMiddleware.routeProtect);

submissionRoutes.post(
    '/start',
    authMiddleware.checkPermission(['assessments:read']), // Estudiantes deben poder leer el assessment
    validatedMiddleware.validateBody(startSubmissionSchema),
    controller.start
);

submissionRoutes.patch(
    '/:id/sync',
    authMiddleware.checkPermission(['assessments:read']),
    validatedMiddleware.validateBody(syncSubmissionSchema),
    controller.sync
);

submissionRoutes.post(
    '/:id/finish',
    authMiddleware.checkPermission(['assessments:read']),
    controller.finish
);

// Get calling student's active in-progress submission (before /:id)
submissionRoutes.get(
    '/active',
    authMiddleware.checkPermission(['assessments:read']),
    controller.getActive
);

// Get calling student's submissions for an offering (before /:id)
submissionRoutes.get(
    '/my-submissions',
    authMiddleware.checkPermission(['assessments:read']),
    controller.getMySubmissions
);

// Get calling student's course grades for an offering (before /:id)
submissionRoutes.get(
    '/course/:offeringId/grades',
    authMiddleware.checkPermission(['assessments:read']),
    controller.getMyCourseGrades
);

// Get sanitized feedback for student's submission on an assessment (before /:id)
submissionRoutes.get(
    '/assessment/:assessmentId/feedback',
    authMiddleware.checkPermission(['assessments:read']),
    controller.getFeedbackByAssessment
);

// Get all student submissions for an assessment (teacher view, before /:id)
submissionRoutes.get(
    '/assessment/:assessmentId',
    authMiddleware.checkPermission(['assessments:read']),
    controller.getByAssessment
);

// Grade a submission
submissionRoutes.patch(
    '/:id/grade',
    authMiddleware.checkPermission(['assessments:read']),
    controller.grade
);

submissionRoutes.get(
    '/:id/events',
    authMiddleware.checkPermission(['assessments:read']),
    controller.subscribeEvents
);

// Get student's sanitized evaluation feedback for a submission
submissionRoutes.get(
    '/:id/feedback',
    authMiddleware.checkPermission(['assessments:read']),
    controller.getFeedback
);

submissionRoutes.get(
    '/:id',
    authMiddleware.checkPermission(['assessments:read']),
    controller.getById
);

// Dedicated endpoint for persisting the student's code snapshot.
submissionRoutes.put(
    '/:id/code',
    authMiddleware.checkPermission(['assessments:read']),
    validatedMiddleware.validateBody(updateCodeSnapshotSchema),
    controller.updateCodeSnapshot
);

// Execute the student's current code snapshot.
// Runtime errors (exceptions, non-zero exit) are part of the 200 response body.
submissionRoutes.post(
    '/:id/run',
    authMiddleware.checkPermission(['assessments:read']),
    validatedMiddleware.validateBody(runCodeSchema),
    controller.runCode
);
