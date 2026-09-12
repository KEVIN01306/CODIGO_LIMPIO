import type { AuthRepository } from "../domain/auth.repository.js";

export class LogoutUseCase {
    constructor(
        private readonly authRepository: AuthRepository
    ) { }

    async execute(refreshToken?: string): Promise<void> {
        if (refreshToken) {
            await this.authRepository.deleteSessionByToken(refreshToken);
        }
    }
}
