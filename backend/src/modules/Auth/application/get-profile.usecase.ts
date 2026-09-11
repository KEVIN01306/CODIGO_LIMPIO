import AppError from "@shared/errors/AppError.js";
import type { AuthRepository } from "../domain/auth.repository.js";

interface GetProfileResponse {
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
    isStudent: boolean;
    isTeacher: boolean;
}

export class GetProfileUseCase {
    constructor(
        private readonly authRepository: AuthRepository
    ) { }

    async execute(userId: string): Promise<GetProfileResponse> {
        const user = await this.authRepository.findById(userId)

        if (!user) {
            throw new AppError("User not found", "NOT_FOUND", 404)
        }

        return {
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            roles: user.roles,
            permissions: user.permissions,
            isStudent: user.isStudent,
            isTeacher: user.isTeacher,
        }
    }
}
