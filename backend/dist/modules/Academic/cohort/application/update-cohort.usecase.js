import AppError from "@shared/errors/AppError.js";
export class UpdateCohortUseCase {
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
    async execute(id, data, tenantId) {
        try {
            const existing = await this.cohortsRepository.findById(id);
            if (!existing) {
                throw new AppError("Cohort not found", "NOT_FOUND", 404);
            }
            // We must verify the existing cohort belongs to the tenant
            // Since cohort itself doesn't have tenantId directly, we check through campus
            const existingCampus = await this.campusesRepository.findById(existing.campusId);
            if (!existingCampus || existingCampus.tenantId !== tenantId) {
                throw new AppError("Cohort not found", "NOT_FOUND", 404);
            }
            if (data.campusId && data.campusId !== existing.campusId) {
                const campus = await this.campusesRepository.findById(data.campusId);
                if (!campus || campus.tenantId !== tenantId) {
                    throw new AppError("Invalid campus", "INVALID_CAMPUS", 400);
                }
            }
            if (data.programId && data.programId !== existing.programId) {
                const program = await this.academicProgramsRepository.findById(data.programId);
                if (!program || program.tenantId !== tenantId) {
                    throw new AppError("Invalid academic program", "INVALID_PROGRAM", 400);
                }
            }
            const cohort = await this.cohortsRepository.update(id, data);
            await this.createAuditLogUseCase.execute({
                action: 'UPDATE',
                resource: 'COHORT',
                resourceId: cohort.id,
                details: { updatedFields: Object.keys(data) }
            }).catch(err => console.error("Failed to create audit log for cohort update", err));
            return cohort;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error updating cohort", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=update-cohort.usecase.js.map