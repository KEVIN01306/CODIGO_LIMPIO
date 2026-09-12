import AppError from "../../../shared/errors/AppError.js";
export class GetProfileUseCase {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(userId) {
        const user = await this.authRepository.getDetailedProfile(userId);
        if (!user) {
            throw new AppError("User not found", "NOT_FOUND", 404);
        }
        const campus = user.student?.campus || user.teacher?.campus;
        const establishment = campus?.name || user.tenant?.name || "No especificado";
        const roles = user.userRoles?.map((ur) => ur.role?.name) || [];
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            tenantId: user.tenantId,
            tenantName: user.tenant?.name || "Institución",
            campusId: campus?.id,
            campusName: campus?.name,
            establishment,
            roles,
            isStudent: !!user.student,
            isTeacher: !!user.teacher,
            createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
            studentInfo: user.student ? {
                studentNumber: user.student.studentNumber,
                campusName: user.student.campus?.name || "Campus Principal",
                cohortName: user.student.cohort?.name,
                programName: user.student.cohort?.program?.name,
            } : null,
            teacherInfo: user.teacher ? {
                employeeCode: user.teacher.employeeCode,
                campusName: user.teacher.campus?.name || "Campus Principal",
            } : null,
        };
    }
}
//# sourceMappingURL=get-profile.usecase.js.map