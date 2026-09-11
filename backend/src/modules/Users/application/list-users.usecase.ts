import type { UsersRepository } from "../domain/users.repository.js";
import type { GetSimpleUser } from "../domain/user.entity.js";
import AppError from "@shared/errors/AppError.js";

export class ListUsersUseCase {
    constructor(private readonly usersRepository: UsersRepository) { }

    async execute(): Promise<GetSimpleUser[]> {
        try {
            return await this.usersRepository.findAll();
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching users", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
