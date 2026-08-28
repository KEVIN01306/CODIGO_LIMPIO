import type { PrismaClient } from "@prisma/client";
import type { UsersRepository } from "../domain/users.repository.js";
import type { User, CreateUser, UpdateUser, GetUser, GetSimpleUser } from "../domain/user.entity.js";
export declare class PrismaUsersRepository implements UsersRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(data: CreateUser): Promise<GetUser>;
    update(id: string, data: UpdateUser): Promise<GetUser>;
    findById(id: string): Promise<GetUser | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<GetSimpleUser[]>;
    disable(id: string): Promise<GetUser>;
    softDelete(id: string): Promise<GetUser>;
}
//# sourceMappingURL=prisma-users.repository.d.ts.map