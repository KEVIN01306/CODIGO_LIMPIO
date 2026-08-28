import type { PrismaClient } from "@prisma/client";
import type { UsersRepository } from "../domain/users.repository.js";
import type { User, CreateUser, UpdateUser, GetUser, GetSimpleUser } from "../domain/user.entity.js";
import { PrismaErrorMapper } from "@shared/db/database/prisma/PrismaErrorMapper.js";
import { UsersMapper } from "./mappers/users.mapper.js";

export class PrismaUsersRepository implements UsersRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(data: CreateUser): Promise<GetUser> {
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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async update(id: string, data: UpdateUser): Promise<GetUser> {
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
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findById(id: string): Promise<GetUser | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id }
            });
            return user ? UsersMapper.toGetUser(user) : null;
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email }
            });
            return user ? UsersMapper.toDomain(user) : null;
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async findAll(): Promise<GetSimpleUser[]> {
        try {
            const users = await this.prisma.user.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return users.map(user => UsersMapper.toGetSimpleUser(user));
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async disable(id: string): Promise<GetUser> {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: { isActive: false }
            });
            return UsersMapper.toGetUser(user);
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }

    async softDelete(id: string): Promise<GetUser> {
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data: { isActive: false }
            });
            return UsersMapper.toGetUser(user);
        } catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
