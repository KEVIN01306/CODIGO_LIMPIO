import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { GeminiAiService } from '../infrastructure/gemini-ai.service.js';
import { SocraticChatUseCase } from '../application/socratic-chat.usecase.js';
import { AiController } from './ai.controller.js';
import { aiChatSchema } from '../domain/ai.schemas.js';
import { AuthMiddleware } from '../../../app/middleware/Auth.middleware.js';
import { ValidatedMiddleware } from '../../../app/middleware/Validated.middleware.js';

export const aiRoutes = Router();

const prisma = new PrismaClient();
const geminiService = new GeminiAiService();
const socraticChatUseCase = new SocraticChatUseCase(prisma, geminiService);
const controller = new AiController(socraticChatUseCase);

const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();

aiRoutes.use(authMiddleware.routeProtect);

aiRoutes.post(
  '/submissions/:submissionId/chat',
  authMiddleware.checkPermission(['assessments:read']),
  validatedMiddleware.validateBody(aiChatSchema),
  controller.chat
);
