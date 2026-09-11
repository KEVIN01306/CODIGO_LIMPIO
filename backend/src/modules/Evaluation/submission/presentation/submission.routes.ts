import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaSubmissionRepository } from '../infrastructure/prisma-submission.repository.js';
import { StartSubmissionUseCase } from '../application/start-submission.usecase.js';
import { SyncSubmissionUseCase } from '../application/sync-submission.usecase.js';
import { FinishSubmissionUseCase } from '../application/finish-submission.usecase.js';
import { GetSubmissionUseCase } from '../application/get-submission.usecase.js';
import { SubmissionController } from './submission.controller.js';
import { startSubmissionSchema, syncSubmissionSchema } from '../domain/submission.schemas.js';
import { AuthMiddleware } from '../../../../app/middleware/Auth.middleware.js';
import { ValidatedMiddleware } from '../../../../app/middleware/Validated.middleware.js';

export const submissionRoutes = Router();
const prisma = new PrismaClient();

const repository = new PrismaSubmissionRepository(prisma);
const startUseCase = new StartSubmissionUseCase(repository);
const syncUseCase = new SyncSubmissionUseCase(repository);
const finishUseCase = new FinishSubmissionUseCase(repository);
const getUseCase = new GetSubmissionUseCase(repository);

const controller = new SubmissionController(
    startUseCase,
    syncUseCase,
    finishUseCase,
    getUseCase
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

submissionRoutes.get(
    '/:id',
    authMiddleware.checkPermission(['assessments:read']),
    controller.getById
);
