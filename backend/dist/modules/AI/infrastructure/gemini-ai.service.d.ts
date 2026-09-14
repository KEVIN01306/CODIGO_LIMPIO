import type { ChatMessage } from '../domain/ai.types.js';
export declare class GeminiAiService {
    private readonly ai;
    private readonly modelName;
    constructor();
    /**
     * Generates a streaming response from Gemini using @google/genai
     */
    generateStream(systemInstruction: string, chatHistory: ChatMessage[], studentPrompt: string): AsyncGenerator<string, void, unknown>;
    /**
     * Generates a non-streaming text response from Gemini
     */
    generateText(systemInstruction: string, prompt: string, jsonMode?: boolean): Promise<string>;
}
//# sourceMappingURL=gemini-ai.service.d.ts.map