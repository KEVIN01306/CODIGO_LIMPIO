
import { PrismaClient } from "@prisma/client";
import type { StudentRepository } from "../domain/student.repository.js";

export class PrismaStudentRepository implements StudentRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findAll(params: { skip?: number; take?: number; q?: string; tenantId: string }): Promise<[number, any[]]> {
        const { skip, take, q, tenantId } = params;
        const where: any = { user: { tenantId } };
        
        if (q) {
            where.OR = [
                { user: { firstName: { contains: q, mode: 'insensitive' } } },
                { user: { lastName: { contains: q, mode: 'insensitive' } } },
                { user: { email: { contains: q, mode: 'insensitive' } } },
                { studentNumber: { contains: q, mode: 'insensitive' } }
            ];
        }

        return await Promise.all([
            this.prisma.studentProfile.count({ where }),
            this.prisma.studentProfile.findMany({
                where,
                skip,
                take,
                include: { user: true, campus: true },
                orderBy: { createdAt: 'desc' }
            })
        ]);
    }

    async findById(id: string): Promise<any | null> {
        return await this.prisma.studentProfile.findUnique({
            where: { id },
            include: { user: true, campus: true }
        });
    }

    async update(id: string, data: any): Promise<any> {
        return await this.prisma.$transaction(async (tx) => {
            const profile = await tx.studentProfile.findUnique({ where: { id } });
            if (!profile) return null;

            if (data.firstName || data.lastName) {
                await tx.user.update({
                    where: { id: profile.userId },
                    data: {
                        ...(data.firstName && { firstName: data.firstName }),
                        ...(data.lastName && { lastName: data.lastName })
                    }
                });
            }

            if (data.campusId || data.studentNumber !== undefined) {
                await tx.studentProfile.update({
                    where: { id },
                    data: {
                        ...(data.campusId && { campusId: data.campusId }),
                        ...(data.studentNumber !== undefined && { studentNumber: data.studentNumber })
                    }
                });
            }
            return await tx.studentProfile.findUnique({ where: { id }, include: { user: true, campus: true } });
        });
    }

    async delete(id: string): Promise<void> {
        const profile = await this.prisma.studentProfile.findUnique({ where: { id } });
        if (profile) {
            await this.prisma.user.delete({ where: { id: profile.userId } });
        }
    }
}
