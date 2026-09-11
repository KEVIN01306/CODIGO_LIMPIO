
import { PrismaClient } from "@prisma/client";
import type { TeacherRepository } from "../domain/teacher.repository.js";

export class PrismaTeacherRepository implements TeacherRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findAll(params: { skip?: number; take?: number; q?: string; tenantId: string }): Promise<[number, any[]]> {
        const { skip, take, q, tenantId } = params;
        const where: any = { user: { tenantId } };
        
        if (q) {
            where.OR = [
                { user: { firstName: { contains: q, mode: 'insensitive' } } },
                { user: { lastName: { contains: q, mode: 'insensitive' } } },
                { user: { email: { contains: q, mode: 'insensitive' } } },
                { employeeCode: { contains: q, mode: 'insensitive' } }
            ];
        }

        return await Promise.all([
            this.prisma.teacherProfile.count({ where }),
            this.prisma.teacherProfile.findMany({
                where,
                skip,
                take,
                include: { user: true, campus: true },
                orderBy: { createdAt: 'desc' }
            })
        ]);
    }

    async findById(id: string): Promise<any | null> {
        return await this.prisma.teacherProfile.findUnique({
            where: { id },
            include: { user: true, campus: true }
        });
    }

    async update(id: string, data: any): Promise<any> {
        return await this.prisma.$transaction(async (tx) => {
            const profile = await tx.teacherProfile.findUnique({ where: { id } });
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

            if (data.campusId || data.employeeCode !== undefined) {
                await tx.teacherProfile.update({
                    where: { id },
                    data: {
                        ...(data.campusId && { campusId: data.campusId }),
                        ...(data.employeeCode !== undefined && { employeeCode: data.employeeCode })
                    }
                });
            }
            return await tx.teacherProfile.findUnique({ where: { id }, include: { user: true, campus: true } });
        });
    }

    async delete(id: string): Promise<void> {
        const profile = await this.prisma.teacherProfile.findUnique({ where: { id } });
        if (profile) {
            await this.prisma.user.delete({ where: { id: profile.userId } });
        }
    }
}
