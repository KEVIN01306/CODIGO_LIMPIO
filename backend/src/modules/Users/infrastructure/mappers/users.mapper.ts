import type { User, GetUser, GetSimpleUser } from "../../domain/user.entity.js";

export class UsersMapper {
    static toDomain(user: any): User {
        return {
            id: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            tenantId: user.tenantId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    static toGetUser(user: any): GetUser {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            tenantId: user.tenantId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    static toGetSimpleUser(user: any): GetSimpleUser {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive
        };
    }
}
