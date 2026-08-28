import { PrismaErrorMapper } from "../../../shared/db/database/prisma/PrismaErrorMapper.js";
import { UsersMapper } from "./mappers/users.mapper.js";
export class PrismaUsersRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    passwordHash: data.passwordHash,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    isActive: true
                }
            });
            return UsersMapper.toGetUser(user);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async update(id, data) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    passwordHash: data.passwordHash
                }
            });
            return UsersMapper.toGetUser(user);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findById(id) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id }
            });
            return user ? UsersMapper.toGetUser(user) : null;
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findByEmail(email) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email }
            });
            return user ? UsersMapper.toDomain(user) : null;
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findAll() {
        try {
            const users = await this.prisma.user.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return users.map(user => UsersMapper.toGetSimpleUser(user));
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async disable(id) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: { isActive: false }
            });
            return UsersMapper.toGetUser(user);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async softDelete(id) {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: { isActive: false }
            });
            return UsersMapper.toGetUser(user);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
//# sourceMappingURL=prisma-users.repository.js.map