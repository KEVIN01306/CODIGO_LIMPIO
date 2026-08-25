import type { AuthUser } from "./auth-user.entity.js";
import type { AuthSession } from "./auth-session.entity.js";
export interface AuthRepository {
    findByEmail(email: AuthUser['email']): Promise<AuthUser | null>;
    findById(id: AuthUser['id']): Promise<AuthUser | null>;
    findSessionByToken(token: AuthSession['token']): Promise<AuthSession | null>;
    findSessionByUserId(userId: AuthUser['id']): Promise<AuthSession | null>;
    upsertSession(userId: AuthUser['id'], token: AuthSession['token'], expiresAt: Date): Promise<void>;
}
//# sourceMappingURL=auth.repository.d.ts.map