import AppError from "@shared/errors/AppError.js";
export class ListUsersUseCase {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute() {
        try {
            return await this.usersRepository.findAll();
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching users", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=list-users.usecase.js.map