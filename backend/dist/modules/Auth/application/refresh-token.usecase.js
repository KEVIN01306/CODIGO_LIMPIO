import AppError from "@shared/errors/AppError.js";
export class RefreshTokenUseCase {
    authRepository;
    jwtProvider;
    constructor(authRepository, jwtProvider) {
        this.authRepository = authRepository;
        this.jwtProvider = jwtProvider;
    }
    async execute(token) {
        const payload = await this.jwtProvider.verifyToken(token);
        const existingSession = await this.authRepository.findSessionByToken(token);
        if (!existingSession) {
            throw new AppError("Unauthorized: Invalid token", "UNAUTHORIZED", 401);
        }
        if (!payload.sub) {
            throw new AppError("Malformed token: missing claims", "INVALID_TOKEN_PAYLOAD", 401);
        }
        const user = await this.authRepository.findById(payload.sub);
        if (!user || !user.isActive) {
            throw new AppError("User not found or inactive", "USER_NOT_ALLOWED", 401);
        }
        const { accessToken, refreshToken } = await this.jwtProvider.generateTokens(payload.sub, user.roles, user.permissions, user.tenantId, user.campusId);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.authRepository.upsertSession(payload.sub, refreshToken, expiresAt);
        return {
            accessToken,
            refreshToken,
            user: {
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
                tenantId: user.tenantId,
                campusId: user.campusId,
                permissions: user.permissions,
                roles: user.roles,
                isStudent: user.isStudent,
                isTeacher: user.isTeacher,
            }
        };
    }
}
//# sourceMappingURL=refresh-token.usecase.js.map