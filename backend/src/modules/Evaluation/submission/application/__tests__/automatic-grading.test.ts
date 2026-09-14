import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { GradeAssessmentUseCase } from '../../../../AI/application/grade-assessment.usecase.js';
import { FinishSubmissionUseCase } from '../finish-submission.usecase.js';
import { SubmissionEntity } from '../../domain/submission.entity.js';
import type { SubmissionRepository } from '../../domain/submission.repository.js';
import type { RunCodeUseCase, CodeExecutionResult } from '../run-code.usecase.js';
import AppError from '@shared/errors/AppError.js';

// ── Mock Helpers ────────────────────────────────────────────────────────────

function createMockGeminiService(responseResolver: (prompt: string) => Promise<string>) {
    return {
        generateText: async (systemInstruction: string, prompt: string, jsonMode?: boolean) => {
            return responseResolver(prompt);
        },
        generateStream: async function* () { }
    } as any;
}

function createMockSubmission(overrides: Partial<any> = {}) {
    return new SubmissionEntity(
        overrides.id || 'sub-123',
        overrides.assessmentId || 'assess-100',
        overrides.studentId || 'student-profile-1',
        overrides.status || 'IN_PROGRESS',
        overrides.startedAt || new Date(),
        overrides.submittedAt || null,
        0,
        0,
        overrides.codeSnapshot || { 'src/index.ts': 'console.log("hello world");' },
        overrides.assessment || {
            id: overrides.assessmentId || 'assess-100',
            title: 'Test Assessment',
            description: 'Print hello world',
            maxScore: 100,
            allowedLanguage: 'typescript',
            offeringId: 'offering-1'
        },
        overrides.student || { id: overrides.studentId || 'student-profile-1' },
        null,
        null,
        overrides.totalScore || null,
        overrides.testOutput || null,
        overrides.aiFeedback || null,
        []
    );
}

function createMockRepo(initialSubmission: SubmissionEntity) {
    let current = initialSubmission;
    const updates: any[] = [];

    const repo: SubmissionRepository = {
        findById: async (id: string) => (current.id === id ? current : null),
        findByAssessmentAndStudent: async () => null,
        create: async () => current,
        update: async (id: string, data: any) => {
            updates.push(data);
            current = new SubmissionEntity(
                current.id,
                current.assessmentId,
                current.studentId,
                data.status || current.status,
                current.startedAt,
                data.submittedAt !== undefined ? data.submittedAt : current.submittedAt,
                current.tabSwitchesCount,
                current.clipboardAttempts,
                data.codeSnapshot || current.codeSnapshot,
                current.assessment,
                current.student,
                current.testsPassedScore,
                current.aiQualityScore,
                data.totalScore !== undefined ? data.totalScore : current.totalScore,
                data.testOutput !== undefined ? data.testOutput : current.testOutput,
                data.aiFeedback !== undefined ? data.aiFeedback : current.aiFeedback,
                current.chatHistory
            );
            return current;
        },
        findByAssessment: async () => [current],
        updateGrade: async (id: string, totalScore: number, feedback?: string) => {
            return repo.update(id, { totalScore, aiFeedback: feedback, status: 'EVALUATED' });
        }
    };

    return { repo, getCurrent: () => current, getUpdates: () => updates };
}

function createMockPrisma(options: { studentUserId?: string; studentProfileId?: string } = {}) {
    const studentUserId = options.studentUserId || 'user-1';
    const studentProfileId = options.studentProfileId || 'student-profile-1';

    return {
        studentProfile: {
            findUnique: async (args: any) => {
                if (args.where.userId === studentUserId) {
                    return { id: studentProfileId, userId: studentUserId };
                }
                return null;
            }
        },
        courseEnrollment: {
            findFirst: async () => ({ id: 'enrollment-1' })
        },
        gradeRecord: {
            upsert: async () => ({})
        }
    } as any;
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('Automatic AI Assessment Grading Flow', () => {

    describe('GradeAssessmentUseCase Unit Tests', () => {
        test('GradeAssessmentUseCase: successfully parses JSON score and feedback', async () => {
            const gemini = createMockGeminiService(async () => {
                return JSON.stringify({
                    totalScore: 85,
                    aiFeedback: 'The solution correctly implements the requirements.'
                });
            });

            const useCase = new GradeAssessmentUseCase(gemini);
            const result = await useCase.execute({
                problem: { title: 'Exam 1', description: 'Desc', maxScore: 100 },
                studentSubmission: { code: 'code', codeTree: 'tree', mistakes: [] },
                executionResult: { success: true, stdout: 'ok', stderr: '', exitCode: 0, executionTimeMs: 100 }
            });

            assert.equal(result.totalScore, 85);
            assert.equal(result.aiFeedback, 'The solution correctly implements the requirements.');
        });

        test('GradeAssessmentUseCase: bounds score to maxScore when AI returns higher', async () => {
            const gemini = createMockGeminiService(async () => {
                return JSON.stringify({
                    totalScore: 150, // exceeds maxScore of 100
                    aiFeedback: 'Superb work.'
                });
            });

            const useCase = new GradeAssessmentUseCase(gemini);
            const result = await useCase.execute({
                problem: { title: 'Exam 1', description: 'Desc', maxScore: 100 },
                studentSubmission: { code: 'code', codeTree: 'tree', mistakes: [] },
                executionResult: { success: true, stdout: 'ok', stderr: '', exitCode: 0, executionTimeMs: 100 }
            });

            assert.equal(result.totalScore, 100);
        });

        test('GradeAssessmentUseCase: bounds score to 0 when AI returns negative', async () => {
            const gemini = createMockGeminiService(async () => {
                return JSON.stringify({
                    totalScore: -15,
                    aiFeedback: 'Code did not compile.'
                });
            });

            const useCase = new GradeAssessmentUseCase(gemini);
            const result = await useCase.execute({
                problem: { title: 'Exam 1', description: 'Desc', maxScore: 100 },
                studentSubmission: { code: 'code', codeTree: 'tree', mistakes: [] },
                executionResult: { success: false, stdout: '', stderr: 'error', exitCode: 1, executionTimeMs: 50 }
            });

            assert.equal(result.totalScore, 0);
        });

        test('GradeAssessmentUseCase: rejects non-numeric score safely', async () => {
            const gemini = createMockGeminiService(async () => {
                return JSON.stringify({
                    totalScore: 'excellent', // invalid non-numeric
                    aiFeedback: 'Great job!'
                });
            });

            const useCase = new GradeAssessmentUseCase(gemini);
            await assert.rejects(
                async () => {
                    await useCase.execute({
                        problem: { title: 'Exam 1', description: 'Desc', maxScore: 100 },
                        studentSubmission: { code: 'code', codeTree: 'tree', mistakes: [] },
                        executionResult: { success: true, stdout: 'ok', stderr: '', exitCode: 0, executionTimeMs: 100 }
                    });
                },
                (err: any) => {
                    assert.equal(err instanceof AppError, true);
                    assert.equal(err.code, 'AI_GRADING_FAILED');
                    return true;
                }
            );
        });

        test('GradeAssessmentUseCase: rejects missing or empty feedback', async () => {
            const gemini = createMockGeminiService(async () => {
                return JSON.stringify({
                    totalScore: 90,
                    aiFeedback: '   ' // empty feedback
                });
            });

            const useCase = new GradeAssessmentUseCase(gemini);
            await assert.rejects(
                async () => {
                    await useCase.execute({
                        problem: { title: 'Exam 1', description: 'Desc', maxScore: 100 },
                        studentSubmission: { code: 'code', codeTree: 'tree', mistakes: [] },
                        executionResult: { success: true, stdout: 'ok', stderr: '', exitCode: 0, executionTimeMs: 100 }
                    });
                },
                (err: any) => {
                    assert.equal(err instanceof AppError, true);
                    assert.equal(err.code, 'AI_GRADING_FAILED');
                    return true;
                }
            );
        });
    });

    describe('FinishSubmissionUseCase Integration Flow', () => {

        test('Successful submission: RunCode succeeds, AI grades, score and feedback persisted as EVALUATED', async () => {
            const initialSub = createMockSubmission();
            const { repo, getCurrent } = createMockRepo(initialSub);
            const prisma = createMockPrisma({ studentUserId: 'user-1', studentProfileId: 'student-profile-1' });

            let runCodeCalledWith: any = null;
            const mockRunCode: RunCodeUseCase = {
                execute: async (subId: string, uId: string, snapshot: Record<string, string>, entry: string): Promise<CodeExecutionResult> => {
                    runCodeCalledWith = { subId, uId, snapshot, entry };
                    return {
                        success: true,
                        stdout: 'Execution output: passed 5/5',
                        stderr: '',
                        exitCode: 0,
                        executionTimeMs: 120
                    };
                }
            } as any;

            const gemini = createMockGeminiService(async (prompt) => {
                assert.match(prompt, /Execution output: passed 5\/5/);
                return JSON.stringify({
                    totalScore: 95,
                    aiFeedback: 'All unit test requirements passed with clean structure.'
                });
            });
            const gradeUseCase = new GradeAssessmentUseCase(gemini);

            const finishUseCase = new FinishSubmissionUseCase(repo, mockRunCode, gradeUseCase, prisma);

            const result = await finishUseCase.execute('sub-123', 'user-1', {
                entryFile: 'src/index.ts',
                codeSnapshot: { 'src/index.ts': 'console.log("done");' }
            });

            // 1. Verify RunCode was executed first with latest snapshot and entryFile
            assert.ok(runCodeCalledWith);
            assert.equal(runCodeCalledWith.subId, 'sub-123');
            assert.equal(runCodeCalledWith.entry, 'src/index.ts');

            // 2. Verify submission was marked as EVALUATED with score and feedback
            assert.equal(result.status, 'EVALUATED');
            assert.equal(result.totalScore, 95);
            assert.equal(result.aiFeedback, 'All unit test requirements passed with clean structure.');
            assert.ok(result.submittedAt instanceof Date);

            // 3. Verify in repository
            const persisted = getCurrent();
            assert.equal(persisted.status, 'EVALUATED');
            assert.equal(persisted.totalScore, 95);
        });

        test('Code with execution errors: error passed to AI grading context and graded', async () => {
            const initialSub = createMockSubmission();
            const { repo } = createMockRepo(initialSub);
            const prisma = createMockPrisma({ studentUserId: 'user-1', studentProfileId: 'student-profile-1' });

            const mockRunCode: RunCodeUseCase = {
                execute: async () => ({
                    success: false,
                    stdout: '',
                    stderr: 'SyntaxError: Unexpected token',
                    exitCode: 1,
                    executionTimeMs: 45
                })
            } as any;

            let promptReceived = '';
            const gemini = createMockGeminiService(async (prompt) => {
                promptReceived = prompt;
                return JSON.stringify({
                    totalScore: 30,
                    aiFeedback: 'Code fails to compile due to SyntaxError: Unexpected token.'
                });
            });
            const gradeUseCase = new GradeAssessmentUseCase(gemini);

            const finishUseCase = new FinishSubmissionUseCase(repo, mockRunCode, gradeUseCase, prisma);

            const result = await finishUseCase.execute('sub-123', 'user-1', {
                entryFile: 'src/index.ts'
            });

            // Verify execution error was included in the grading prompt
            assert.match(promptReceived, /SyntaxError: Unexpected token/);
            assert.match(promptReceived, /Runtime \/ Compilation Execution Failure/);

            assert.equal(result.status, 'EVALUATED');
            assert.equal(result.totalScore, 30);
            assert.match(result.aiFeedback, /SyntaxError/);
        });

        test('Gemini failure: no fake score/feedback, submission saved as SUBMITTED', async () => {
            const initialSub = createMockSubmission();
            const { repo, getCurrent } = createMockRepo(initialSub);
            const prisma = createMockPrisma({ studentUserId: 'user-1', studentProfileId: 'student-profile-1' });

            const mockRunCode: RunCodeUseCase = {
                execute: async () => ({
                    success: true,
                    stdout: 'ok',
                    stderr: '',
                    exitCode: 0,
                    executionTimeMs: 100
                })
            } as any;

            const gemini = createMockGeminiService(async () => {
                throw new Error('API network timeout');
            });
            const gradeUseCase = new GradeAssessmentUseCase(gemini);

            const finishUseCase = new FinishSubmissionUseCase(repo, mockRunCode, gradeUseCase, prisma);

            await assert.rejects(
                async () => {
                    await finishUseCase.execute('sub-123', 'user-1', { entryFile: 'src/index.ts' });
                },
                (err: any) => {
                    assert.equal(err instanceof AppError, true);
                    assert.equal(err.code, 'AI_GRADING_FAILED');
                    return true;
                }
            );

            // Verify submission is safely SUBMITTED, NOT EVALUATED, and has NO fake score or fake feedback
            const current = getCurrent();
            assert.equal(current.status, 'SUBMITTED');
            assert.equal(current.totalScore, null);
            assert.equal(current.aiFeedback, null);
            assert.ok(current.submittedAt instanceof Date);
        });

        test('Unauthorized submission: non-owner student rejected with 403, no execution or AI grading', async () => {
            const initialSub = createMockSubmission({ studentId: 'student-profile-OWNER' });
            const { repo } = createMockRepo(initialSub);
            // Calling user maps to student-profile-ATTACKER
            const prisma = createMockPrisma({ studentUserId: 'user-attacker', studentProfileId: 'student-profile-ATTACKER' });

            let runCodeCalled = false;
            const mockRunCode: RunCodeUseCase = {
                execute: async () => {
                    runCodeCalled = true;
                    return { success: true, stdout: '', stderr: '', exitCode: 0, executionTimeMs: 0 };
                }
            } as any;

            let geminiCalled = false;
            const gemini = createMockGeminiService(async () => {
                geminiCalled = true;
                return JSON.stringify({ totalScore: 100, aiFeedback: 'ok' });
            });
            const gradeUseCase = new GradeAssessmentUseCase(gemini);

            const finishUseCase = new FinishSubmissionUseCase(repo, mockRunCode, gradeUseCase, prisma);

            await assert.rejects(
                async () => {
                    await finishUseCase.execute('sub-123', 'user-attacker', { entryFile: 'src/index.ts' });
                },
                (err: any) => {
                    assert.equal(err instanceof AppError, true);
                    assert.equal(err.statusCode, 403);
                    assert.match(err.message, /not authorized/i);
                    return true;
                }
            );

            assert.equal(runCodeCalled, false);
            assert.equal(geminiCalled, false);
        });
    });
});
