import type { HashProvider } from "../../../shared/domain/hash.provider.js";
import type { AuthRepository } from "../domain/auth.repository.js";
import type JwtProvider from "../domain/jwt.provider.js";
interface LoginDTO {
    email: string;
    password: string;
}
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    tenantId: string;
    campusId?: string;
    permissions: string[];
    roles: string[];
    isStudent: boolean;
    isTeacher: boolean;
}
interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
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