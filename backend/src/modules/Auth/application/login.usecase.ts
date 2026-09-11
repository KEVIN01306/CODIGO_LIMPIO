import AppError from "@shared/errors/AppError.js";
import type { HashProvider } from "@shared/domain/hash.provider.js";
import type { AuthRepository } from "../domain/auth.repository.js";
import type JwtProvider from "../domain/jwt.provider.js";



interface LoginDTO {
    email: string,
    password: string,
}

export interface AuthUser {
    id: string,
    name: string,
    email: string,
    tenantId: string,
    campusId?: string,
    permissions: string[],
    roles: string[],
    isStudent: boolean,
    isTeacher: boolean,
}

interface LoginResponse {
    accessToken: string,
    refreshToken: string,
    user: AuthUser,
}


export class LoginUseCase {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtProvider: JwtProvider,
        private readonly hashProvider: HashProvider
    ) { }

    async execute(data: LoginDTO): Promise<LoginResponse> {
        const { email, password } = data

        const user = await this.authRepository.findByEmail(email)

        if (!user) {
            throw new AppError("Invalid credentials", "INVALID_CREDENTIALS", 401)
        }

        if (user.passwordHash === null) {
            throw new AppError("User has no password", "USER_NO_PASSWORD", 403)
        }

        if (!user.isActive) {
            throw new AppError("User is inactive", "USER_INACTIVE", 403)
        }
        let isValid = false
        try {
            isValid = await this.hashProvider.compare(password, user.passwordHash)
        } catch (error) {
            console.log("Error comparing password", error);
            throw new AppError("Error comparing password", "INVALID_CREDENTIALS", 401)
        }

        if (!isValid) {
            throw new AppError("Invalid credentials", "INVALID_CREDENTIALS", 401)
        }

        const { accessToken, refreshToken } = await this.jwtProvider.generateTokens(
            user.id,
            user.roles,
            user.permissions,
            user.tenantId,
            user.campusId
        )

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.authRepository.upsertSession(
            user.id,
            refreshToken,
            expiresAt
        )

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
                tenantId: user.tenantId,
                campusId: user.campusId,
                permissions: user.permissions,
                roles: user.roles,
                isStudent: user.isStudent,
                isTeacher: user.isTeacher,
            }
        }
    }
}