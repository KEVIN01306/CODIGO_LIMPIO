import type { PrismaClient } from "@prisma/client";
import type { AuthRepository } from "../domain/auth.repository.js";
import type { AuthUser } from "../domain/auth-user.entity.js";
import type { AuthSession } from "../domain/auth-session.entity.js";
import { AuthMapper } from "./mappers/auth.mapper.js";

export class PrismaAuthRespository implements AuthRepository {
    constructor(private readonly db: PrismaClient) { }

    async findByEmail(email: AuthUser["email"]): Promise<AuthUser | null> {
        const user = await this.db.user.findFirst({
            where: { email, isActive: true },
            include: {
                userRoles: {
                    select: {
                        role: {
                            select: {
                                name: true,
                                rolePermissions: {
                                    select: {
                                        permission: { select: { action: true } }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) return null;

        return AuthMapper.toDomain(user);
    }

    async findById(id: AuthUser["id"]): Promise<AuthUser | null> {
        const user = await this.db.user.findUnique({
            where: { id, isActive: true },
            include: {
                userRoles: {
                    select: {
                        role: {
                            select: {
                                name: true,
                                rolePermissions: {
                                    select: {
                                        permission: { select: { action: true } }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) return null;

        return AuthMapper.toDomain(user);
    }

    async upsertSession(
        userId: AuthUser["id"],
        token: AuthSession['token'],
        expiresAt: Date
    ): Promise<void> {
        await this.db.userSession.upsert({
            where: { userId }, // Now userId is unique and can be used for upsert
            update: {
                token,
                expiresAt
            },
            create: {
                userId,
                token,
                expiresAt
            }
        });
    }

    async findSessionByToken(token: AuthSession["token"]): Promise<AuthSession | null> {
        const sessionDb = await this.db.userSession.findUnique({
            where: { token }
        });

        if (!sessionDb) return null;

        return {
            id: sessionDb.id,
            token: sessionDb.token,
            userId: sessionDb.userId,
            expiresAt: sessionDb.expiresAt,
            createdAt: sessionDb.createdAt
        };
    }

    async findSessionByUserId(userId: AuthUser["id"]): Promise<AuthSession | null> {
        const sessionDb = await this.db.userSession.findFirst({
            where: { userId }
        });

        if (!sessionDb) return null;

        return {
            id: sessionDb.id,
            token: sessionDb.token,
            userId: sessionDb.userId,
            expiresAt: sessionDb.expiresAt,
            createdAt: sessionDb.createdAt
        };
    }
}