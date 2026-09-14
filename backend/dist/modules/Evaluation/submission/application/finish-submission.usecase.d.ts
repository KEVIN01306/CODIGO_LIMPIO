import { PrismaClient } from '@prisma/client';
import type { SubmissionRepository } from '../domain/submission.repository.js';
import type { SubmissionEntity } from '../domain/submission.entity.js';
import type { RunCodeUseCase } from './run-code.usecase.js';
import type { GradeAssessmentUseCase } from '../../../AI/application/grade-assessment.usecase.js';
export interface FinishSubmissionOptions {
    entryFile?: string;
    codeSnapshot?: Record<string, string>;
}
export declare class FinishSubmissionUseCase {
    private readonly submissionRepo;
    private readonly runCodeUseCase;
    private readonly gradeAssessmentUseCase;
    private readonly prisma;
    constructor(submissionRepo: SubmissionRepository, runCodeUseCase: RunCodeUseCase, gradeAssessmentUseCase: GradeAssessmentUseCase, prisma: PrismaClient);
    execute(id: string, userId: string, options?: FinishSubmissionOptions): Promise<SubmissionEntity>;
    private inferEntryFile;
    private formatFileTree;
    private formatStudentCode;
}
//# sourceMappingURL=finish-submission.usecase.d.ts.map