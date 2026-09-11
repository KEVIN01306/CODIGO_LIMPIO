import AppError from "../../../../shared/errors/AppError.js";
import { UniqueConstraintError } from "../../../../shared/db/database/errors/UniqueConstraintError.js";
export class CreateCourseUseCase {
    coursesRepository;
    academicProgramsRepository;
    createAuditLogUseCase;
    constructor(coursesRepository, academicProgramsRepository, createAuditLogUseCase) {
        this.coursesRepository = coursesRepository;
        this.academicProgramsRepository = academicProgramsRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(data) {
        try {
            const program = await this.academicProgramsRepository.findById(data.programId);
            if (!program || program.tenantId !== data.tenantId) {
                throw new AppError("Invalid academic program", "INVALID_PROGRAM", 400);
            }
            const existing = await this.coursesRepository.findByCode(data.tenantId, data.code);
            if (existing) {
                throw new AppError("Course code already exists in this program", "CODE_ALREADY_EXISTS", 400);
            }
            const course = await this.coursesRepository.create({
                tenantId: data.tenantId,
                programId: data.programId,
                code: data.code,
                name: data.name,
                description: data.description,
                credits: data.credits
            });
            await this.createAuditLogUseCase.execute({
                action: 'CREATE',
                resource: 'COURSE',
                resourceId: course.id,
                details: { code: course.code, name: course.name }
            }).catch((err) => console.error("Failed to create audit log for course creation", err));
            return course;
        }
        catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new AppError("Course code already exists in this program", "CODE_ALREADY_EXISTS", 400);
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error creating course", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=create-course.usecase.js.map