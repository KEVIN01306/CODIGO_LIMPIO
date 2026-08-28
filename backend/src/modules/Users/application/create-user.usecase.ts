import type { UsersRepository } from "../domain/users.repository.js";
import type { GetUser } from "../domain/user.entity.js";
import AppError from "@shared/errors/AppError.js";
import type { HashProvider } from "@shared/domain/hash.provider.js";
import { UniqueConstraintError } from "@shared/db/database/errors/UniqueConstraintError.js";
import type { CreateAuditLogUseCase } from "../../Audit/application/create-audit-log.usecase.js";

interface CreateUserRequest {
    email: string;
    passwordRaw: string;
    firstName: string;
    lastName: string;
}

export class CreateUserUseCase {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly hashProvider: HashProvider,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) {}

    async execute(data: CreateUserRequest): Promise<GetUser> {
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
                lastName: data.lastName
            });

            await this.createAuditLogUseCase.execute({
                action: 'CREATE',
                resource: 'USER',
                resourceId: user.id,
                details: { email: user.email }
            }).catch(err => console.error("Failed to create audit log for user creation", err));

            return user;
        } catch (error) {
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
