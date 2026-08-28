import type { UsersRepository } from "../domain/users.repository.js";
import type { GetSimpleUser } from "../domain/user.entity.js";
export declare class ListUsersUseCase {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    execute(): Promise<GetSimpleUser[]>;
}
//# sourceMappingURL=list-users.usecase.d.ts.map