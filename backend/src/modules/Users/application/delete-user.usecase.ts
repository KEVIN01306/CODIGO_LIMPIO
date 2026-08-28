import type { UsersRepository } from "../domain/users.repository.js";
import type { GetUser } from "../domain/user.entity.js";
import AppError from "@shared/errors/AppError.js";
import { NotFoundPersistenceError } from "@shared/db/database/errors/NotFoundPersistenceError.js";

export class DeleteUserUseCase {
    constructor(private readonly usersRepository: UsersRepository) {}

    async execute(id: string): Promise<GetUser> {
        try {
            const user = await this.usersRepository.findById(id);
            if (!user) {
                throw new AppError("User not found", "USER_NOT_FOUND", 404);
            }

            return await this.usersRepository.softDelete(id);
        } catch (error) {
            if (error instanceof NotFoundPersistenceError) {
                throw new AppError("User not found", "USER_NOT_FOUND", 404);
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error deleting user", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
