import { PrismaErrorMapper } from "@shared/db/database/prisma/PrismaErrorMapper.js";
import { CourseMapper } from "./mappers/course.mapper.js";
export class PrismaCoursesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        try {
            const course = await this.prisma.course.create({
                data: {
                    tenantId: data.tenantId,
                    programId: data.programId,
                    code: data.code,
                    name: data.name,
                    description: data.description,
                    credits: data.credits
                },
                include: {
                    program: true
                }
            });
            return CourseMapper.toGetCourse(course);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async update(id, data) {
        try {
            const course = await this.prisma.course.update({
                where: { id },
                data: {
                    programId: data.programId,
                    code: data.code,
                    name: data.name,
                    description: data.description,
                    credits: data.credits,
                    isActive: data.isActive
                },
                include: {
                    program: true
                }
            });
            return CourseMapper.toGetCourse(course);
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findById(id) {
        try {
            const course = await this.prisma.course.findUnique({
                where: { id },
                include: {
                    program: true
                }
            });
            return course ? CourseMapper.toGetCourse(course) : null;
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findByCode(tenantId, code) {
        try {
            const course = await this.prisma.course.findUnique({
                where: {
                    tenantId_code: {
                        tenantId,
                        code
                    }
                }
            });
            return course ? CourseMapper.toDomain(course) : null;
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async findAll(page, perPage, filters) {
        try {
            const skip = (page - 1) * perPage;
            const where = {};
            if (filters.tenantId) {
                where.tenantId = filters.tenantId;
            }
            if (filters.programId) {
                where.programId = filters.programId;
            }
            if (filters.isActive !== undefined) {
                where.isActive = filters.isActive;
            }
            if (filters.q) {
                where.OR = [
                    { code: { contains: filters.q } },
                    { name: { contains: filters.q } }
                ];
            }
            const [total, items] = await Promise.all([
                this.prisma.course.count({ where }),
                this.prisma.course.findMany({
                    where,
                    skip,
                    take: perPage,
                    include: {
                        program: true
                    },
                    orderBy: { name: 'asc' }
                })
            ]);
            return {
                total,
                data: items.map(item => CourseMapper.toGetSimpleCourse(item))
            };
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
    async delete(id) {
        try {
            await this.prisma.course.delete({
                where: { id }
            });
        }
        catch (error) {
            throw PrismaErrorMapper.map(error);
        }
    }
}
//# sourceMappingURL=prisma-course.repository.js.map