import AppError from "@shared/errors/AppError.js";
export class LoginUseCase {
    authRepository;
    jwtProvider;
    hashProvider;
    constructor(authRepository, jwtProvider, hashProvider) {
        this.authRepository = authRepository;
        this.jwtProvider = jwtProvider;
        this.hashProvider = hashProvider;
    }
    async execute(data) {
        const { email, password } = data;
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new AppError("Invalid credentials", "INVALID_CREDENTIALS", 401);
        }
        if (user.passwordHash === null) {
            throw new AppError("User has no password", "USER_NO_PASSWORD", 403);
        }
        if (!user.isActive) {
            throw new AppError("User is inactive", "USER_INACTIVE", 403);
        }
        let isValid = false;
        try {
            isValid = await this.hashProvider.compare(password, user.passwordHash);
        }
        catch (error) {
            console.log("Error comparing password", error);
            throw new AppError("Error comparing password", "INVALID_CREDENTIALS", 401);
        }
        if (!isValid) {
            throw new AppError("Invalid credentials", "INVALID_CREDENTIALS", 401);
        }
        const { accessToken, refreshToken } = await this.jwtProvider.generateTokens(user.id, user.roles, user.permissions, user.tenantId, user.campusId);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.authRepository.upsertSession(user.id, refreshToken, expiresAt);
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
//# sourceMappingURL=login.usecase.js.map