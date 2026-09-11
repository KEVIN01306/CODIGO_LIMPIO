import type { CoursesRepository } from "../../course/domain/course.repository.js";
import AppError from "@shared/errors/AppError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

export class DeleteCourseUseCase {
    constructor(
        private readonly coursesRepository: CoursesRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) { }

    async execute(id: string, tenantId: string): Promise<void> {
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
            }).catch((err: any) => console.error("Failed to create audit log for course deletion", err));

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error deleting course", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
