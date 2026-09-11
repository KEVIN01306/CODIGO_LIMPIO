import AppError from "@shared/errors/AppError.js";
import { UniqueConstraintError } from "@shared/db/database/errors/UniqueConstraintError.js";
export class CreateUserUseCase {
    usersRepository;
    hashProvider;
    createAuditLogUseCase;
    constructor(usersRepository, hashProvider, createAuditLogUseCase) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(data) {
        try {
            const existingUser = await this.usersRepository.findByEmail(data.email);
            if (existingUser) {
                throw new AppError("Email already in use", "EMAIL_ALREADY_EXISTS", 400);
            }
            const passwordHash = await this.hashProvider.hash(data.passwordRaw);
            const user = await this.usersRepository.create({
                email: data.email,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                tenantId: data.tenantId
            });
            await this.createAuditLogUseCase.execute({
                action: 'CREATE',
                resource: 'USER',
                resourceId: user.id,
                details: { email: user.email }
            }).catch(err => console.error("Failed to create audit log for user creation", err));
            return user;
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new AppError("Email already in use", "EMAIL_ALREADY_EXISTS", 400);
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error creating user", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=create-user.usecase.js.map