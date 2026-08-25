import type { HashProvider } from "../../../shared/domain/hash.provider.js";
import type { AuthRepository } from "../domain/auth.repository.js";
import type JwtProvider from "../domain/jwt.provider.js";
interface LoginDTO {
    email: string;
    password: string;
}
interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        name: string;
        email: string;
        permissions: string[];
        roles: string[];
    };
}
export declare class LoginUseCase {
    private readonly authRepository;
    private readonly jwtProvider;
    private readonly hashProvider;
    constructor(authRepository: AuthRepository, jwtProvider: JwtProvider, hashProvider: HashProvider);
    execute(data: LoginDTO): Promise<LoginResponse>;
}
export {};
//# sourceMappingURL=login.usecase.d.ts.map