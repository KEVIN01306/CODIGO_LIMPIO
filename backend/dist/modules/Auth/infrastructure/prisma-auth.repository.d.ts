import type { PrismaClient } from "@prisma/client";
import type { AuthRepository } from "../domain/auth.repository.js";
import type { AuthUser } from "../domain/auth-user.entity.js";
import type { AuthSession } from "../domain/auth-session.entity.js";
export declare class PrismaAuthRespository implements AuthRepository {
    private readonly db;
    constructor(db: PrismaClient);
    findByEmail(email: AuthUser["email"]): Promise<AuthUser | null>;
    findById(id: AuthUser["id"]): Promise<AuthUser | null>;
    upsertSession(userId: AuthUser["id"], token: AuthSession['token'], expiresAt: Date): Promise<void>;
    findSessionByToken(token: AuthSession["token"]): Promise<AuthSession | null>;
    findSessionByUserId(userId: AuthUser["id"]): Promise<AuthSession | null>;
    deleteSessionByToken(token: AuthSession["token"]): Promise<void>;
    getDetailedProfile(id: AuthUser["id"]): Promise<any>;
}
//# sourceMappingURL=prisma-auth.repository.d.ts.map