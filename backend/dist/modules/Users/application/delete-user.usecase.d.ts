import type { UsersRepository } from "../domain/users.repository.js";
import type { GetUser } from "../domain/user.entity.js";
export declare class DeleteUserUseCase {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    execute(id: string): Promise<GetUser>;
}
//# sourceMappingURL=delete-user.usecase.d.ts.map