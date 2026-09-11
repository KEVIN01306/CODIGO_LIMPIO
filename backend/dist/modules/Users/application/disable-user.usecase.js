import AppError from "@shared/errors/AppError.js";
import { NotFoundPersistenceError } from "@shared/db/database/errors/NotFoundPersistenceError.js";
export class DisableUserUseCase {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(id) {
        try {
            const user = await this.usersRepository.findById(id);
            if (!user) {
                throw new AppError("User not found", "USER_NOT_FOUND", 404);
            }
            return await this.usersRepository.disable(id);
        }
        catch (error) {
            if (error instanceof NotFoundPersistenceError) {
                throw new AppError("User not found", "USER_NOT_FOUND", 404);
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error disabling user", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=disable-user.usecase.js.map