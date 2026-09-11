import AppError from "@shared/errors/AppError.js";
import { UniqueConstraintError } from "@shared/db/database/errors/UniqueConstraintError.js";
import { NotFoundPersistenceError } from "@shared/db/database/errors/NotFoundPersistenceError.js";
export class UpdateUserUseCase {
    usersRepository;
    createAuditLogUseCase;
    constructor(usersRepository, createAuditLogUseCase) {
        this.usersRepository = usersRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id, data) {
        try {
            const user = await this.usersRepository.findById(id);
            if (!user) {
                throw new AppError("User not found", "USER_NOT_FOUND", 404);
            }
            if (data.email && data.email !== user.email) {
                const existingEmail = await this.usersRepository.findByEmail(data.email);
                if (existingEmail) {
                    throw new AppError("Email already in use", "EMAIL_ALREADY_EXISTS", 400);
                }
            }
            const updatedUser = await this.usersRepository.update(id, data);
            await this.createAuditLogUseCase.execute({
                action: 'UPDATE',
                resource: 'USER',
                resourceId: updatedUser.id,
                details: { updatedFields: Object.keys(data) }
            }).catch(err => console.error("Failed to create audit log for user update", err));
            return updatedUser;
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new AppError("Email already in use", "EMAIL_ALREADY_EXISTS", 400);
            }
            if (error instanceof NotFoundPersistenceError) {
                throw new AppError("User not found", "USER_NOT_FOUND", 404);
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error updating user", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=update-user.usecase.js.map