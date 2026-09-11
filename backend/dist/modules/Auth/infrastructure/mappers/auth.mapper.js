export class AuthMapper {
    static toDomain(user) {
        return {
            id: user.id,
            tenantId: user.tenantId,
            campusId: user.student?.campusId || user.teacher?.campusId || undefined,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            passwordHash: user.passwordHash,
            isActive: user.isActive,
            roles: user.userRoles?.map((ur) => ur.role?.name) || [],
            permissions: user.userRoles?.flatMap((ur) => ur.role?.rolePermissions?.map((rp) => rp.permission?.action) || []) || [],
            isStudent: !!user.student,
            isTeacher: !!user.teacher
        };
    }
}
//# sourceMappingURL=auth.mapper.js.map