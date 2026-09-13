import { MayeuticaPromptBuilder } from '../infrastructure/mayeutica-prompt.builder.js';
import { submissionEventBus } from '../../Evaluation/submission/infrastructure/submission-events.bus.js';
import AppError from '../../../shared/errors/AppError.js';
export class SocraticChatUseCase {
    prisma;
    geminiService;
    constructor(prisma, geminiService) {
        this.prisma = prisma;
        this.geminiService = geminiService;
    }
    async execute(params) {
        const { submissionId, userId, studentPrompt, clientChatHistory, workspaceContext, onChunk, signal } = params;
        // 1. Verify submission exists
        const submission = await this.prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                assessment: true,
            },
        });
        if (!submission) {
            throw new AppError('Submission not found', 'NOT_FOUND', 404);
        }
        // 2. Resolve student profile and verify ownership
        const studentProfile = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });
        if (!studentProfile) {
            throw new AppError('Only students can interact with Mayéutica', 'FORBIDDEN', 403);
        }
        if (submission.studentId !== studentProfile.id) {
            throw new AppError('You are not authorized to access this submission chat', 'FORBIDDEN', 403);
        }
        // 3. Editability check - must be IN_PROGRESS
        if (submission.status !== 'IN_PROGRESS') {
            throw new AppError('Cannot chat with Mayéutica for a finalized or inactive submission', 'BAD_REQUEST', 400);
        }
        // 4. Resolve authoritative exercise goal from Assessment
        const assessment = submission.assessment;
        const authoritativeGoal = [
            assessment.title,
            assessment.description ? assessment.description.trim() : '',
        ]
            .filter(Boolean)
            .join(' - ');
        const finalWorkspaceContext = {
            ...workspaceContext,
            exerciseGoal: authoritativeGoal || workspaceContext.exerciseGoal || 'Programming exercise',
            language: workspaceContext.language || assessment.allowedLanguage || 'javascript',
        };
        // 5. Authoritative chat history (use database as source of truth if available, otherwise client history)
        const existingDbHistory = submission.chatHistory || [];
        const currentHistory = Array.isArray(existingDbHistory) && existingDbHistory.length > 0
            ? existingDbHistory
            : clientChatHistory || [];
        // 6. Notify real-time listeners that student asked a question
        const temporaryHistory = [
            ...currentHistory,
            { role: 'user', content: studentPrompt },
        ];
        submissionEventBus.publish({
            type: 'STUDENT_ASKED',
            submissionId,
            chatHistory: temporaryHistory,
            timestamp: new Date().toISOString(),
        });
        // 7. Build Socratic prompt instruction
        const systemInstruction = MayeuticaPromptBuilder.buildSystemInstruction(finalWorkspaceContext);
        // 8. Stream from Gemini
        const stream = this.geminiService.generateStream(systemInstruction, currentHistory, studentPrompt);
        let assistantResponse = '';
        for await (const chunk of stream) {
            if (signal?.aborted) {
                break;
            }
            assistantResponse += chunk;
            onChunk(chunk);
        }
        // 9. Persist updated history only if response was generated
        if (!assistantResponse.trim()) {
            throw new AppError('Gemini did not return any response content', 'AI_GENERATION_FAILED', 502);
        }
        const updatedHistory = [
            ...currentHistory,
            { role: 'user', content: studentPrompt },
            { role: 'assistant', content: assistantResponse },
        ];
        await this.prisma.submission.update({
            where: { id: submissionId },
            data: {
                chatHistory: updatedHistory,
            },
        });
        // 10. Publish full updated chat history to real-time subscribers
        submissionEventBus.publish({
            type: 'CHAT_UPDATED',
            submissionId,
            chatHistory: updatedHistory,
            timestamp: new Date().toISOString(),
        });
        return { updatedHistory, assistantResponse };
    }
}
//# sourceMappingURL=socratic-chat.usecase.js.map