import BaseController from '../../../presentation/base.controller.js';
export class AiController extends BaseController {
    socraticChatUseCase;
    constructor(socraticChatUseCase) {
        super();
        this.socraticChatUseCase = socraticChatUseCase;
    }
    /**
     * POST /ai/submissions/:submissionId/chat
     * Server-Sent Events (SSE) streaming endpoint for Mayéutica Socratic tutor.
     */
    chat = async (req, res, next) => {
        const abortController = new AbortController();
        req.on('close', () => {
            abortController.abort();
        });
        let headersSent = false;
        try {
            const submissionId = req.params.submissionId;
            const user = req.user;
            const { studentPrompt, chatHistory, workspaceContext } = req.body;
            // Set SSE headers as required
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            if (typeof res.flushHeaders === 'function') {
                res.flushHeaders();
            }
            headersSent = true;
            // Stream response chunks
            const result = await this.socraticChatUseCase.execute({
                submissionId,
                userId: user.id,
                studentPrompt,
                clientChatHistory: chatHistory,
                workspaceContext,
                onChunk: (chunk) => {
                    if (!res.writableEnded) {
                        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
                    }
                },
                signal: abortController.signal,
            });
            if (!res.writableEnded) {
                res.write(`data: ${JSON.stringify({
                    done: true,
                    assistantResponse: result.assistantResponse,
                    chatHistory: result.updatedHistory,
                })}\n\n`);
                res.end();
            }
        }
        catch (error) {
            if (headersSent && !res.writableEnded) {
                res.write(`data: ${JSON.stringify({
                    error: error.message || 'An error occurred while generating the response',
                })}\n\n`);
                res.end();
            }
            else {
                next(error);
            }
        }
    };
}
//# sourceMappingURL=ai.controller.js.map