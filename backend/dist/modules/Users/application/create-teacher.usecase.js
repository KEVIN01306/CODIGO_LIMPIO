import { PrismaClient } from "@prisma/client";
import AppError from "../../../shared/errors/AppError.js";
const prisma = new PrismaClient();
export class CreateTeacherUseCase {
    hashProvider;
    createAuditLogUseCase;
    constructor(hashProvider, createAuditLogUseCase) {
        this.hashProvider = hashProvider;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(data) {
        // 1. Validate if user exists
        const existingUser = await prisma.user.findFirst({
            where: { email: data.email, tenantId: data.tenantId }
        });
        if (existingUser) {
            throw new AppError("Email already in use", "EMAIL_ALREADY_EXISTS", 400);
        }
        // 2. Hash password
        const passwordHash = await this.hashProvider.hash(data.passwordRaw);
        // 3. Get TEACHER role
        const teacherRole = await prisma.role.findFirst({
            where: { name: 'TEACHER', tenantId: data.tenantId }
        });
        if (!teacherRole) {
            throw new AppError("Teacher role not found. Run seed.", "ROLE_NOT_FOUND", 500);
        }
        // 4. Create in transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    passwordHash,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    tenantId: data.tenantId,
                    userRoles: {
                        create: {
                            roleId: teacherRole.id
                        }
                    },
                    teacher: {
                        create: {
                            campusId: data.campusId,
                            employeeCode: data.employeeCode
                        }
                    }
                },
                include: {
                    teacher: true
                }
            });
            return user;
        });
        await this.createAuditLogUseCase.execute({
            action: 'CREATE',
            resource: 'TEACHER',
            resourceId: result.id,
            details: { email: result.email, campusId: data.campusId }
        }).catch(err => console.error("Failed to create audit log", err));
        // Sanitize output
        const { passwordHash: _, ...safeUser } = result;
        return safeUser;
    }
}
//# sourceMappingURL=create-teacher.usecase.js.map