import type { AssessmentRepository } from "../domain/assessment.repository.js";
import type { SubmissionRepository } from "../../submission/domain/submission.repository.js";
import type { StudentRepository } from "../../../Users/domain/student.repository.js";
import type { CourseEnrollmentRepository } from "../../../Assignment/courseEnrollment/domain/courseEnrollment.repository.js";
import type { TenantRepository } from "../../../Tenant/domain/tenant.repository.js";
import type { SebJwtProvider } from "../../../../shared/infrastructure/seb-jwt.provider.js";
export interface StartAssessmentResult {
    requiresSeb: boolean;
    redirectUrl: string;
    submissionId: string;
}
export declare class StartAssessmentUseCase {
    private readonly assessmentRepo;
    private readonly submissionRepo;
    private readonly studentRepo;
    private readonly enrollmentRepo;
    private readonly tenantRepo;
    private readonly sebJwtProvider;
    constructor(assessmentRepo: AssessmentRepository, submissionRepo: SubmissionRepository, studentRepo: StudentRepository, enrollmentRepo: CourseEnrollmentRepository, tenantRepo: TenantRepository, sebJwtProvider: SebJwtProvider);
    execute(assessmentId: string, userId: string): Promise<StartAssessmentResult>;
}
//# sourceMappingURL=start-assessment.usecase.d.ts.map