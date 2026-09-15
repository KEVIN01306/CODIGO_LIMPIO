import prisma from "@infrastructure/config/prisma/prisma.config.js";
import AppError from "@shared/errors/AppError.js";

export class GetDashboardSummaryUseCase {
    async execute(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                tenant: true,
                student: {
                    include: {
                        enrollments: {
                            where: { status: 'ENROLLED' },
                            include: {
                                offering: {
                                    include: { course: true, cycle: true }
                                }
                            }
                        }
                    }
                },
                teacher: {
                    include: {
                        courseOfferings: {
                            include: { course: true, cycle: true }
                        }
                    }
                }
            }
        });

        if (!user) {
            throw new AppError("User not found", "NOT_FOUND", 404);
        }

        const roles = [];
        if (user.student) roles.push('STUDENT');
        if (user.teacher) roles.push('TEACHER');
        if (roles.length === 0) roles.push('ADMIN');

        const studentCourses = user.student?.enrollments.map(e => ({
            id: e.offering.course.id,
            offeringId: e.offeringId,
            code: e.offering.course.code,
            name: e.offering.course.name,
            credits: e.offering.course.credits,
            cycle: e.offering.cycle.name,
            section: e.offering.section
        })) || [];

        const teacherCourses = user.teacher?.courseOfferings.map(o => ({
            id: o.course.id,
            offeringId: o.id,
            code: o.course.code,
            name: o.course.name,
            credits: o.course.credits,
            cycle: o.cycle.name,
            section: o.section
        })) || [];

        return {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                roles
            },
            tenant: {
                name: user.tenant.name,
                slug: user.tenant.slug
            },
            studentCourses,
            teacherCourses
        };
    }
}
