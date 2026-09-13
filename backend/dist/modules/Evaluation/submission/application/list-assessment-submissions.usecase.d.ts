import { PrismaClient } from '@prisma/client';
import type { SubmissionRepository } from '../domain/submission.repository.js';
export declare class ListAssessmentSubmissionsUseCase {
    private readonly submissionRepository;
    private readonly prisma;
    constructor(submissionRepository: SubmissionRepository, prisma: PrismaClient);
    execute(assessmentId: string): Promise<{
        assessment: {
            id: string;
            offeringId: string;
            title: string;
            description: string | null;
            type: import("@prisma/client").$Enums.AssessmentType;
            maxScore: number;
            weight: number | null;
            dueDate: Date | null;
            strictMode: boolean;
            allowedLanguage: string | null;
            timeLimitMinutes: number | null;
            course: {
                id: string;
                name: string;
                code: string;
            };
            offering: {
                id: string;
                section: string;
                cycle: string;
                campus: string;
            };
        };
        students: {
            enrollmentId: string;
            studentId: string;
            studentNumber: string;
            firstName: string;
            lastName: string;
            fullName: string;
            email: string;
            enrollmentStatus: import("@prisma/client").$Enums.EnrollmentStatus;
            hasSubmitted: boolean;
            submission: {
                id: any;
                status: any;
                startedAt: any;
                submittedAt: any;
                tabSwitchesCount: any;
                clipboardAttempts: any;
                testsPassedScore: any;
                aiQualityScore: any;
                totalScore: any;
                feedback: any;
                testOutput: any;
                codeSnapshot: any;
                chatHistory: any;
                filesCount: number;
            } | null;
        }[];
        stats: {
            totalEnrolled: number;
            submittedCount: number;
            inProgressCount: number;
            notStartedCount: number;
            gradedCount: number;
            integrityViolationsCount: number;
        };
    }>;
}
//# sourceMappingURL=list-assessment-submissions.usecase.d.ts.map