import AppError from "../../../shared/errors/AppError.js";
export class GetProfileUseCase {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(userId) {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new AppError("User not found", "NOT_FOUND", 404);
        }
        return {
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            roles: user.roles,
            permissions: user.permissions,
            isStudent: user.isStudent,
            isTeacher: user.isTeacher,
        };
    }
}
//# sourceMappingURL=get-profile.usecase.js.map