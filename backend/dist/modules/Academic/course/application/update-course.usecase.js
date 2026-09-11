import AppError from "../../../../shared/errors/AppError.js";
import { UniqueConstraintError } from "../../../../shared/db/database/errors/UniqueConstraintError.js";
export class UpdateCourseUseCase {
    coursesRepository;
    academicProgramsRepository;
    createAuditLogUseCase;
    constructor(coursesRepository, academicProgramsRepository, createAuditLogUseCase) {
        this.coursesRepository = coursesRepository;
        this.academicProgramsRepository = academicProgramsRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(id, data, tenantId) {
        try {
            const existing = await this.coursesRepository.findById(id);
            if (!existing || existing.tenantId !== tenantId) {
                throw new AppError("Course not found", "NOT_FOUND", 404);
            }
            if (data.programId && data.programId !== existing.programId) {
                const program = await this.academicProgramsRepository.findById(data.programId);
                if (!program || program.tenantId !== tenantId) {
                    throw new AppError("Invalid academic program", "INVALID_PROGRAM", 400);
                }
            }
            if (data.code && data.code !== existing.code) {
                const codeExists = await this.coursesRepository.findByCode(tenantId, data.code);
                if (codeExists && codeExists.id !== id) {
                    throw new AppError("Course code already exists in this tenant", "CODE_ALREADY_EXISTS", 400);
                }
            }
            const course = await this.coursesRepository.update(id, data);
            await this.createAuditLogUseCase.execute({
                action: 'UPDATE',
                resource: 'COURSE',
                resourceId: course.id,
                details: { updatedFields: Object.keys(data) }
            }).catch(err => console.error("Failed to create audit log for course update", err));
            return course;
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new AppError("Course code already exists in this program", "CODE_ALREADY_EXISTS", 400);
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error updating course", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=update-course.usecase.js.map