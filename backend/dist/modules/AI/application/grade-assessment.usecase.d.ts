import { GeminiAiService } from '../infrastructure/gemini-ai.service.js';
import type { GradeAssessmentInputDTO, GradingResultDTO } from '../domain/ai.types.js';
export declare class GradeAssessmentUseCase {
    private readonly geminiService;
    constructor(geminiService: GeminiAiService);
    execute(input: GradeAssessmentInputDTO): Promise<GradingResultDTO>;
    /**
     * Deterministically parses the model output, handling JSON blocks or textual fallback.
     */
    private parseGradingResponse;
}
//# sourceMappingURL=grade-assessment.usecase.d.ts.map