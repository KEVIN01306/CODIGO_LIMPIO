import type { HashProvider } from "../../../shared/domain/hash.provider.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
interface CreateTeacherRequest {
    tenantId: string;
    email: string;
    passwordRaw: string;
    firstName: string;
    lastName: string;
    campusId: string;
    employeeCode?: string;
}
export declare class CreateTeacherUseCase {
    private readonly hashProvider;
    private readonly createAuditLogUseCase;
    constructor(hashProvider: HashProvider, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(data: CreateTeacherRequest): Promise<{
        teacher: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            campusId: string;
            employeeCode: string | null;
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
//# sourceMappingURL=create-teacher.usecase.d.ts.map