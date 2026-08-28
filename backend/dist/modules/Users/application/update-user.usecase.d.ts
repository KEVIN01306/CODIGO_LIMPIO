import type { UsersRepository } from "../domain/users.repository.js";
import type { UpdateUser, GetUser } from "../domain/user.entity.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";
export declare class UpdateUserUseCase {
    private readonly usersRepository;
    private readonly createAuditLogUseCase;
    constructor(usersRepository: UsersRepository, createAuditLogUseCase: CreateAuditLogUseCase);
    execute(id: string, data: UpdateUser): Promise<GetUser>;
}
//# sourceMappingURL=update-user.usecase.d.ts.map