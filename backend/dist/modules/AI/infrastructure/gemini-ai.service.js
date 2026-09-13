import { GoogleGenAI } from '@google/genai';
import AppError from '../../../shared/errors/AppError.js';
export class GeminiAiService {
    ai;
    modelName;
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new AppError('GEMINI_API_KEY is not configured on the server', 'INTERNAL_SERVER_ERROR', 500);
        }
        this.ai = new GoogleGenAI({ apiKey });
        this.modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    }
    /**
     * Generates a streaming response from Gemini using @google/genai
     */
    async *generateStream(systemInstruction, chatHistory, studentPrompt) {
        try {
            // Map domain roles ('user', 'assistant') to Gemini roles ('user', 'model')
            const contents = [];
            for (const msg of chatHistory) {
                if (!msg.content || typeof msg.content !== 'string')
                    continue;
                contents.push({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }],
                });
            }
            // Add the latest student prompt
            contents.push({
                role: 'user',
                parts: [{ text: studentPrompt }],
            });
            const responseStream = await this.ai.models.generateContentStream({
                model: this.modelName,
                contents,
                config: {
                    systemInstruction,
                },
            });
            for await (const chunk of responseStream) {
                const text = chunk.text;
                if (text) {
                    yield text;
                }
            }
        }
        catch (error) {
            console.error('[GeminiAiService] Error generating stream:', error);
            throw new AppError('Failed to generate AI tutor response. Please try again.', 'AI_GENERATION_FAILED', 502);
        }
    }
}
//# sourceMappingURL=gemini-ai.service.js.map