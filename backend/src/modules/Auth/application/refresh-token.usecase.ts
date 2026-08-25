import AppError from "@shared/errors/AppError.js";
import type { AuthSession } from "../domain/auth-session.entity.js";
import type { AuthRepository } from "../domain/auth.repository.js";
import type JwtProvider from "../domain/jwt.provider.js";



interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        name: string;
        email: string;
        permissions: string[];
        roles: string[];
    }
}   


export class RefreshTokenUseCase {
    
    constructor (
        private readonly authRepository: AuthRepository,
        private readonly jwtProvider: JwtProvider
    ) {}

    async execute(token: AuthSession['token']): Promise<RefreshResponse>{

        const payload = await this.jwtProvider.verifyToken(token)
        
        const existingSession = await this.authRepository.findSessionByToken(token)

        if (!existingSession) {
            throw new AppError("Unauthorized: Invalid token", "UNAUTHORIZED", 401)
        }

        if (!payload.sub) {
            throw new AppError("Malformed token: missing claims", "INVALID_TOKEN_PAYLOAD", 401)
        }

        const user = await this.authRepository.findById(payload.sub)

        if (!user || !user.isActive) {
            throw new AppError("User not found or inactive", "USER_NOT_ALLOWED", 401)
        }

        const { accessToken, refreshToken } = await this.jwtProvider.generateTokens(
            payload.sub,
            user.roles,
            user.permissions
        )

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.authRepository.upsertSession(
            payload.sub,
            refreshToken,
            expiresAt
        )
    
        return {
            accessToken,
            refreshToken,
            user: {
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
                permissions: user.permissions,
                roles: user.roles,
            }
        }
    }
}