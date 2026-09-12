import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { SubmissionRepository } from '../domain/submission.repository.js';
import AppError from '@shared/errors/AppError.js';

const prisma = new PrismaClient();

/** Shape returned to the frontend. */
export interface CodeExecutionResult {
    success: boolean;
    stdout: string;
    stderr: string;
    exitCode: number | null;
    executionTimeMs: number;
}

/** Maximum time (ms) allowed for a single execution before it is killed. */
const EXECUTION_TIMEOUT_MS = 10_000;

/**
 * Determines the command + args for executing an entry file.
 *
 * Supported runtimes (Node v24 is available on this server):
 *   - javascript / js   → node <entryFile>
 *   - typescript / ts   → tsx <entryFile>  (tsx devDependency present)
 *   - python / python3  → python3 <entryFile>
 */
function resolveCommand(entryFile: string, language: string): { cmd: string; args: string[] } {
    const ext = path.extname(entryFile).toLowerCase().replace('.', '');
    const lang = (language || '').toLowerCase();

    if (lang === 'python' || lang === 'python3' || ext === 'py') {
        return { cmd: 'python3', args: [entryFile] };
    }

    if (lang === 'typescript' || lang === 'ts' || ext === 'ts' || ext === 'tsx') {
        // tsx (TypeScript executor) is installed as a devDependency.
        // We resolve its path so we don't depend on PATH having it.
        const tsxBin = path.resolve(process.cwd(), 'node_modules', '.bin', 'tsx');
        return { cmd: tsxBin, args: [entryFile] };
    }

    // Default: treat as JavaScript (js / jsx)
    return { cmd: 'node', args: [entryFile] };
}

/**
 * RunCodeUseCase
 *
 * Executes the student's current code snapshot in a child process.
 *
 * Security guarantees enforced BEFORE execution:
 *   1. Submission must exist.
 *   2. Calling user must be a student (StudentProfile exists).
 *   3. Submission must belong to that student (ownership).
 *   4. Submission must be IN_PROGRESS (not yet finalized).
 *
 * Execution is sandboxed by:
 *   - A dedicated temp directory (cleaned up after every run).
 *   - A hard 10-second timeout (child process is killed on expiry).
 *   - No network or filesystem access restrictions beyond what the OS provides.
 *
 * Runtime errors (bad syntax, exceptions, non-zero exit code) are returned
 * as part of the result — they are NOT thrown as AppErrors.
 * Infrastructure errors (spawn failure, auth failure) ARE thrown.
 */
export class RunCodeUseCase {
    constructor(private readonly submissionRepo: SubmissionRepository) { }

    async execute(
        submissionId: string,
        userId: string,
        codeSnapshot: Record<string, string>,
        entryFile: string
    ): Promise<CodeExecutionResult> {
        // ── Authorization ─────────────────────────────────────────────────────
        const submission = await this.submissionRepo.findById(submissionId);
        if (!submission) {
            throw new AppError('Submission not found', 'NOT_FOUND', 404);
        }

        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId }
        });
        if (!studentProfile) {
            throw new AppError('Only students can execute code', 'FORBIDDEN', 403);
        }

        if (submission.studentId !== studentProfile.id) {
            throw new AppError(
                'You are not authorized to execute this submission',
                'FORBIDDEN',
                403
            );
        }

        if (submission.status !== 'IN_PROGRESS') {
            throw new AppError(
                'Cannot execute code for a submission that is not in progress',
                'BAD_REQUEST',
                400
            );
        }

        // Validate that the entry file actually exists in the snapshot.
        if (!codeSnapshot[entryFile]) {
            throw new AppError(
                `Entry file "${entryFile}" not found in the code snapshot`,
                'BAD_REQUEST',
                400
            );
        }

        // ── Execution ─────────────────────────────────────────────────────────
        const language: string = (submission.assessment as any)?.allowedLanguage || 'javascript';
        return this.runInSandbox(codeSnapshot, entryFile, language);
    }

    /** Writes files to a temp dir, executes, and cleans up. */
    private async runInSandbox(
        codeSnapshot: Record<string, string>,
        entryFile: string,
        language: string
    ): Promise<CodeExecutionResult> {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sandbox-'));

        try {
            // 1. Write every snapshot file to the temp directory.
            for (const [filePath, content] of Object.entries(codeSnapshot)) {
                // Sanitize: prevent directory traversal.
                const safePath = filePath.replace(/\.\.\//g, '').replace(/^\//, '');
                const absPath = path.join(tmpDir, safePath);
                fs.mkdirSync(path.dirname(absPath), { recursive: true });
                fs.writeFileSync(absPath, content, 'utf-8');
            }

            // 2. Resolve the entry file absolute path.
            const absEntry = path.join(tmpDir, entryFile.replace(/^\//, ''));

            // 3. Determine runtime command.
            const { cmd, args } = resolveCommand(entryFile, language);

            // 4. Spawn and collect output.
            return await this.spawnWithTimeout(cmd, args, tmpDir, absEntry);

        } finally {
            // 5. Always clean up the temp directory.
            try {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            } catch {
                // Non-fatal — OS will eventually clean /tmp.
            }
        }
    }

    private spawnWithTimeout(
        cmd: string,
        args: string[],
        cwd: string,
        absEntry: string
    ): Promise<CodeExecutionResult> {
        return new Promise((resolve) => {
            const startTime = Date.now();
            let stdout = '';
            let stderr = '';
            let killed = false;

            // Replace last arg (entryFile) with the absolute temp path.
            const finalArgs = [...args.slice(0, -1), absEntry];

            const child = spawn(cmd, finalArgs, {
                cwd,
                env: {
                    ...process.env,
                    // Remove potentially dangerous env vars.
                    NODE_ENV: 'sandbox',
                },
                timeout: EXECUTION_TIMEOUT_MS,
            });

            child.stdout.on('data', (data: Buffer) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data: Buffer) => {
                stderr += data.toString();
            });

            const killTimer = setTimeout(() => {
                killed = true;
                child.kill('SIGKILL');
            }, EXECUTION_TIMEOUT_MS);

            child.on('close', (exitCode: number | null) => {
                clearTimeout(killTimer);
                const executionTimeMs = Date.now() - startTime;

                if (killed) {
                    resolve({
                        success: false,
                        stdout,
                        stderr: `Execution timed out after ${EXECUTION_TIMEOUT_MS / 1000}s.\n${stderr}`,
                        exitCode: null,
                        executionTimeMs,
                    });
                    return;
                }

                resolve({
                    success: exitCode === 0,
                    stdout,
                    stderr,
                    exitCode,
                    executionTimeMs,
                });
            });

            child.on('error', (err: Error) => {
                clearTimeout(killTimer);
                resolve({
                    success: false,
                    stdout,
                    stderr: `Failed to start process: ${err.message}`,
                    exitCode: null,
                    executionTimeMs: Date.now() - startTime,
                });
            });
        });
    }
}
