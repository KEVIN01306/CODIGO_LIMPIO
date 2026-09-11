import AppError from "@shared/errors/AppError.js";
export class DeleteCourseUseCase {
    coursesRepository;
    createAuditLogUseCase;
    constructor(coursesRepository, createAuditLogUseCase) {
        this.coursesRepository = coursesRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id, tenantId) {
        try {
            const existing = await this.coursesRepository.findById(id);
            if (!existing || existing.tenantId !== tenantId) {
                throw new AppError("Course not found", "NOT_FOUND", 404);
            }
            await this.coursesRepository.delete(id);
            await this.createAuditLogUseCase.execute({
                action: 'DELETE',
                resource: 'COURSE',
                resourceId: id,
                details: { deleted: true }
            }).catch((err) => console.error("Failed to create audit log for course deletion", err));
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error deleting course", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=delete-course.usecase.js.map