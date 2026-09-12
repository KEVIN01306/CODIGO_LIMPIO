export class LogoutUseCase {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(refreshToken) {
        if (refreshToken) {
            await this.authRepository.deleteSessionByToken(refreshToken);
        }
    }
}
//# sourceMappingURL=logout.usecase.js.map