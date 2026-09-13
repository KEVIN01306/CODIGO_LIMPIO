import type { Request, Response, NextFunction } from 'express';
import BaseController from '../../../presentation/base.controller.js';
import type { SocraticChatUseCase } from '../application/socratic-chat.usecase.js';
export declare class AiController extends BaseController {
    private readonly socraticChatUseCase;
    constructor(socraticChatUseCase: SocraticChatUseCase);
    /**
     * POST /ai/submissions/:submissionId/chat
     * Server-Sent Events (SSE) streaming endpoint for Mayéutica Socratic tutor.
     */
    chat: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=ai.controller.d.ts.map