import AppError from "@shared/errors/AppError.js";
export class CreateCohortUseCase {
    cohortsRepository;
    campusesRepository;
    academicProgramsRepository;
    createAuditLogUseCase;
    constructor(cohortsRepository, campusesRepository, academicProgramsRepository, createAuditLogUseCase) {
        this.cohortsRepository = cohortsRepository;
        this.campusesRepository = campusesRepository;
        this.academicProgramsRepository = academicProgramsRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(data) {
        try {
            const campus = await this.campusesRepository.findById(data.campusId);
            if (!campus || campus.tenantId !== data.tenantId) {
                throw new AppError("Invalid campus", "INVALID_CAMPUS", 400);
            }
            const program = await this.academicProgramsRepository.findById(data.programId);
            if (!program || program.tenantId !== data.tenantId) {
                throw new AppError("Invalid academic program", "INVALID_PROGRAM", 400);
            }
            const cohort = await this.cohortsRepository.create(data);
            await this.createAuditLogUseCase.execute({
                action: 'CREATE',
                resource: 'COHORT',
                resourceId: cohort.id,
                details: { name: cohort.name }
            }).catch(err => console.error("Failed to create audit log for cohort creation", err));
            return cohort;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error creating cohort", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=create-cohort.usecase.js.map