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
import { SubmissionController } from './submission.controller.js';
import { startSubmissionSchema, syncSubmissionSchema, updateCodeSnapshotSchema, runCodeSchema } from '../domain/submission.schemas.js';
import { AuthMiddleware } from '../../../../app/middleware/Auth.middleware.js';
import { ValidatedMiddleware } from '../../../../app/middleware/Validated.middleware.js';
export const submissionRoutes = Router();
const prisma = new PrismaClient();
const repository = new PrismaSubmissionRepository(prisma);
const startUseCase = new StartSubmissionUseCase(repository);
const syncUseCase = new SyncSubmissionUseCase(repository);
const finishUseCase = new FinishSubmissionUseCase(repository);
const getUseCase = new GetSubmissionUseCase(repository);
const updateCodeSnapshotUseCase = new UpdateCodeSnapshotUseCase(repository);
const runCodeUseCase = new RunCodeUseCase(repository);
const listAssessmentSubmissionsUseCase = new ListAssessmentSubmissionsUseCase(repository, prisma);
const gradeSubmissionUseCase = new GradeSubmissionUseCase(repository);
const controller = new SubmissionController(startUseCase, syncUseCase, finishUseCase, getUseCase, updateCodeSnapshotUseCase, runCodeUseCase, listAssessmentSubmissionsUseCase, gradeSubmissionUseCase);
const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();
// Middleware de autenticación global para este módulo
submissionRoutes.use(authMiddleware.routeProtect);
submissionRoutes.post('/start', authMiddleware.checkPermission(['assessments:read']), // Estudiantes deben poder leer el assessment
validatedMiddleware.validateBody(startSubmissionSchema), controller.start);
submissionRoutes.patch('/:id/sync', authMiddleware.checkPermission(['assessments:read']), validatedMiddleware.validateBody(syncSubmissionSchema), controller.sync);
submissionRoutes.post('/:id/finish', authMiddleware.checkPermission(['assessments:read']), controller.finish);
// Get all student submissions for an assessment (before /:id)
submissionRoutes.get('/assessment/:assessmentId', authMiddleware.checkPermission(['assessments:read']), controller.getByAssessment);
// Grade a submission
submissionRoutes.patch('/:id/grade', authMiddleware.checkPermission(['assessments:read']), controller.grade);
submissionRoutes.get('/:id', authMiddleware.checkPermission(['assessments:read']), controller.getById);
// Dedicated endpoint for persisting the student's code snapshot.
submissionRoutes.put('/:id/code', authMiddleware.checkPermission(['assessments:read']), validatedMiddleware.validateBody(updateCodeSnapshotSchema), controller.updateCodeSnapshot);
// Execute the student's current code snapshot.
// Runtime errors (exceptions, non-zero exit) are part of the 200 response body.
submissionRoutes.post('/:id/run', authMiddleware.checkPermission(['assessments:read']), validatedMiddleware.validateBody(runCodeSchema), controller.runCode);
//# sourceMappingURL=submission.routes.js.map