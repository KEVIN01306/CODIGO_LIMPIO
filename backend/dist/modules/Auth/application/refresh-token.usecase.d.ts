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
    };
}
export declare class RefreshTokenUseCase {
    private readonly authRepository;
    private readonly jwtProvider;
    constructor(authRepository: AuthRepository, jwtProvider: JwtProvider);
    execute(token: AuthSession['token']): Promise<RefreshResponse>;
}
export {};
//# sourceMappingURL=refresh-token.usecase.d.ts.map