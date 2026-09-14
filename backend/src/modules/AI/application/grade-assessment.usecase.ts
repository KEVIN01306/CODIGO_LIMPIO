import { GeminiAiService } from '../infrastructure/gemini-ai.service.js';
import { GradingPromptBuilder } from '../infrastructure/grading-prompt.builder.js';
import type { GradeAssessmentInputDTO, GradingResultDTO } from '../domain/ai.types.js';
import AppError from '@shared/errors/AppError.js';

export class GradeAssessmentUseCase {
  constructor(private readonly geminiService: GeminiAiService) {}

  async execute(input: GradeAssessmentInputDTO): Promise<GradingResultDTO> {
    const { problem } = input;

    if (!problem || typeof problem.maxScore !== 'number' || problem.maxScore <= 0) {
      throw new AppError('Invalid assessment maximum score', 'BAD_REQUEST', 400);
    }

    const systemInstruction = GradingPromptBuilder.buildSystemInstruction();
    const prompt = GradingPromptBuilder.buildPrompt(input);

    let rawResponse: string;
    try {
      rawResponse = await this.geminiService.generateText(systemInstruction, prompt, true);
    } catch (err: any) {
      console.error('[GradeAssessmentUseCase] Gemini execution error:', err);
      throw new AppError(
        'AI grading service unavailable or failed to respond',
        'AI_GRADING_FAILED',
        502
      );
    }

    if (!rawResponse || !rawResponse.trim()) {
      throw new AppError('AI grading model returned an empty response', 'AI_GRADING_FAILED', 502);
    }

    const parsed = this.parseGradingResponse(rawResponse);

    // ── Score Validation ─────────────────────────────────────────────────────────
    if (parsed.totalScore === null || parsed.totalScore === undefined || isNaN(Number(parsed.totalScore))) {
      throw new AppError(
        `AI grading produced an invalid or non-numeric score: "${parsed.totalScore}"`,
        'AI_GRADING_FAILED',
        502
      );
    }

    const rawScore = Number(parsed.totalScore);
    if (!isFinite(rawScore)) {
      throw new AppError('AI grading produced a non-finite score', 'AI_GRADING_FAILED', 502);
    }

    // Clamp score to [0, problem.maxScore] and round to 2 decimal places
    const clampedScore = Math.max(0, Math.min(rawScore, problem.maxScore));
    const finalScore = Math.round(clampedScore * 100) / 100;

    // ── AI Feedback Validation ───────────────────────────────────────────────────
    if (!parsed.aiFeedback || typeof parsed.aiFeedback !== 'string' || !parsed.aiFeedback.trim()) {
      throw new AppError(
        'AI grading did not return valid non-empty evaluation feedback',
        'AI_GRADING_FAILED',
        502
      );
    }

    return {
      totalScore: finalScore,
      aiFeedback: parsed.aiFeedback.trim(),
    };
  }

  /**
   * Deterministically parses the model output, handling JSON blocks or textual fallback.
   */
  private parseGradingResponse(raw: string): { totalScore: any; aiFeedback: any } {
    let clean = raw.trim();

    // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    // Try standard JSON parsing
    try {
      const obj = JSON.parse(clean);
      if (obj && typeof obj === 'object') {
        const score = obj.totalScore !== undefined ? obj.totalScore : obj.score;
        const feedback = obj.aiFeedback !== undefined ? obj.aiFeedback : (obj.feedback || obj.comments);
        return { totalScore: score, aiFeedback: feedback };
      }
    } catch {
      // Fallback: regular expression extraction
    }

    // Fallback regex extraction
    let score: any = null;
    let feedback: any = null;

    const scoreMatch = clean.match(/"?totalScore"?\s*:\s*"?([0-9]+(?:\.[0-9]+)?)"?/i);
    if (scoreMatch && scoreMatch[1] !== undefined) {
      score = Number(scoreMatch[1]);
    }

    const feedbackMatch = clean.match(/"?aiFeedback"?\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/i);
    if (feedbackMatch && feedbackMatch[1] !== undefined) {
      feedback = feedbackMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
    } else {
      // Look for aiFeedback: "..." across lines
      const textFeedbackMatch = clean.match(/aiFeedback\s*:\s*(.+)/is);
      if (textFeedbackMatch && textFeedbackMatch[1] !== undefined) {
        feedback = textFeedbackMatch[1].trim();
      }
    }

    return { totalScore: score, aiFeedback: feedback };
  }
}
