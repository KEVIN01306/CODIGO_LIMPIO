import { PrismaUsersRepository } from "./infrastructure/prisma-users.repository.js";
import { Argon2HashProvider } from "../../shared/infrastructure/argon2-hash.provider.js";
import { CreateUserUseCase } from "./application/create-user.usecase.js";
import { UpdateUserUseCase } from "./application/update-user.usecase.js";
import { ListUsersUseCase } from "./application/list-users.usecase.js";
import { DisableUserUseCase } from "./application/disable-user.usecase.js";
import { DeleteUserUseCase } from "./application/delete-user.usecase.js";
import { UsersController } from "./presentation/users.controller.js";
export declare const usersRepository: PrismaUsersRepository;
export declare const hashProvider: Argon2HashProvider;
export declare const createUserUseCase: CreateUserUseCase;
export declare const updateUserUseCase: UpdateUserUseCase;
export declare const listUsersUseCase: ListUsersUseCase;
export declare const disableUserUseCase: DisableUserUseCase;
export declare const deleteUserUseCase: DeleteUserUseCase;
export declare const usersController: UsersController;
//# sourceMappingURL=users.module.d.ts.map