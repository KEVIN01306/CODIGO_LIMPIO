import { PrismaClient } from '@prisma/client';
import { GeminiAiService } from '../infrastructure/gemini-ai.service.js';
import type { ChatMessage, WorkspaceContext } from '../domain/ai.types.js';
export declare class SocraticChatUseCase {
    private readonly prisma;
    private readonly geminiService;
    constructor(prisma: PrismaClient, geminiService: GeminiAiService);
    execute(params: {
        submissionId: string;
        userId: string;
        studentPrompt: string;
        clientChatHistory: ChatMessage[];
        workspaceContext: WorkspaceContext;
        onChunk: (chunk: string) => void;
        signal?: AbortSignal;
    }): Promise<{
        updatedHistory: ChatMessage[];
        assistantResponse: string;
    }>;
}
//# sourceMappingURL=socratic-chat.usecase.d.ts.map