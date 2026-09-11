import { AuthMapper } from "./mappers/auth.mapper.js";
export class PrismaAuthRespository {
    db;
    constructor(db) {
        this.db = db;
    }
    async findByEmail(email) {
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
                },
                student: { select: { campusId: true } },
                teacher: { select: { campusId: true } }
            }
        });
        if (!user)
            return null;
        return AuthMapper.toDomain(user);
    }
    async findById(id) {
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
                },
                student: { select: { campusId: true } },
                teacher: { select: { campusId: true } }
            }
        });
        if (!user)
            return null;
        return AuthMapper.toDomain(user);
    }
    async upsertSession(userId, token, expiresAt) {
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
    async findSessionByToken(token) {
        const sessionDb = await this.db.userSession.findUnique({
            where: { token }
        });
        if (!sessionDb)
            return null;
        return {
            id: sessionDb.id,
            token: sessionDb.token,
            userId: sessionDb.userId,
            expiresAt: sessionDb.expiresAt,
            createdAt: sessionDb.createdAt
        };
    }
    async findSessionByUserId(userId) {
        const sessionDb = await this.db.userSession.findFirst({
            where: { userId }
        });
        if (!sessionDb)
            return null;
        return {
            id: sessionDb.id,
            token: sessionDb.token,
            userId: sessionDb.userId,
            expiresAt: sessionDb.expiresAt,
            createdAt: sessionDb.createdAt
        };
    }
}
//# sourceMappingURL=prisma-auth.repository.js.map