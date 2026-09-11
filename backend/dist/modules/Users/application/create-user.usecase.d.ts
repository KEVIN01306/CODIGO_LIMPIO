import type { UsersRepository } from "../domain/users.repository.js";
import type { GetUser } from "../domain/user.entity.js";
import type { HashProvider } from "../../../shared/domain/hash.provider.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
interface CreateUserRequest {
    email: string;
    passwordRaw: string;
    firstName: string;
    lastName: string;
    tenantId: string;
}
export declare class CreateUserUseCase {
    private readonly usersRepository;
    private readonly hashProvider;
    private readonly createAuditLogUseCase;
    constructor(usersRepository: UsersRepository, hashProvider: HashProvider, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(data: CreateUserRequest): Promise<GetUser>;
}
export {};
//# sourceMappingURL=create-user.usecase.d.ts.map