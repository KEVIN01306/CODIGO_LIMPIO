export class PrismaStudentRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { skip, take, q, tenantId } = params;
        const where = { user: { tenantId } };
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
    async findById(id) {
        return await this.prisma.studentProfile.findUnique({
            where: { id },
            include: { user: true, campus: true }
        });
    }
    async update(id, data) {
        return await this.prisma.$transaction(async (tx) => {
            const profile = await tx.studentProfile.findUnique({ where: { id } });
            if (!profile)
                return null;
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
    async delete(id) {
        const profile = await this.prisma.studentProfile.findUnique({ where: { id } });
        if (profile) {
            await this.prisma.user.delete({ where: { id: profile.userId } });
        }
    }
}
//# sourceMappingURL=prisma-student.repository.js.map