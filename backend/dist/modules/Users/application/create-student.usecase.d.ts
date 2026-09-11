import type { HashProvider } from "../../../shared/domain/hash.provider.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
interface CreateStudentRequest {
    tenantId: string;
    email: string;
    passwordRaw: string;
    firstName: string;
    lastName: string;
    campusId: string;
    studentNumber: string;
}
export declare class CreateStudentUseCase {
    private readonly hashProvider;
    private readonly createAuditLogUseCase;
    constructor(hashProvider: HashProvider, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(data: CreateStudentRequest): Promise<{
        student: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            campusId: string;
            cohortId: string | null;
            studentNumber: string;
        } | null;
        email: string;
        id: string;
        tenantId: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
//# sourceMappingURL=create-student.usecase.d.ts.map