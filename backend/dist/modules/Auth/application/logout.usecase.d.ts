import type { AuthRepository } from "../domain/auth.repository.js";
export declare class LogoutUseCase {
    private readonly authRepository;
    constructor(authRepository: AuthRepository);
    execute(refreshToken?: string): Promise<void>;
}
//# sourceMappingURL=logout.usecase.d.ts.map