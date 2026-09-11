import type { CoursesRepository } from "../../course/domain/course.repository.js";
import type { AcademicProgramsRepository } from "../../program/domain/academicProgram.repository.js";
import type { GetCourse } from "../../course/domain/course.entity.js";
import AppError from "@shared/errors/AppError.js";
import { UniqueConstraintError } from "@shared/db/database/errors/UniqueConstraintError.js";
import type { CreateAuditLogUseCase } from "@modules/Audit/application/create-audit-log.usecase.js";

interface CreateCourseRequest {
    tenantId: string;
    programId: string;
    code: string;
    name: string;
    description: string | null;
    credits: number;
}

export class CreateCourseUseCase {
    constructor(
        private readonly coursesRepository: CoursesRepository,
        private readonly academicProgramsRepository: AcademicProgramsRepository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) {}

    async execute(data: CreateCourseRequest): Promise<GetCourse> {
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
            }).catch((err: any) => console.error("Failed to create audit log for course creation", err));

            return course;
        } catch (error) {
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
