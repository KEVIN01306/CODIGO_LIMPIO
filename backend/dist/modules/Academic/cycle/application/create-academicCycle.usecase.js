import AppError from "../../../../shared/errors/AppError.js";
export class CreateAcademicCycleUseCase {
    academicCyclesRepository;
    campusesRepository;
    createAuditLogUseCase;
    constructor(academicCyclesRepository, campusesRepository, createAuditLogUseCase) {
        this.academicCyclesRepository = academicCyclesRepository;
        this.campusesRepository = campusesRepository;
        this.createAuditLogUseCase = createAuditLogUseCase;
    }
    async execute(data) {
        try {
            const campus = await this.campusesRepository.findById(data.campusId);
            if (!campus || campus.tenantId !== data.tenantId) {
                throw new AppError("Invalid campus", "INVALID_CAMPUS", 400);
            }
            if (data.startDate >= data.endDate) {
                throw new AppError("End date must be after start date", "INVALID_DATES", 400);
            }
            const cycle = await this.academicCyclesRepository.create({
                campusId: data.campusId,
                name: data.name,
                year: data.year,
                order: data.order,
                startDate: data.startDate,
                endDate: data.endDate,
                isCurrent: data.isCurrent
            });
            await this.createAuditLogUseCase.execute({
                action: 'CREATE',
                resource: 'ACADEMIC_CYCLE',
                resourceId: cycle.id,
                details: { name: cycle.name }
            }).catch((err) => console.error("Failed to create audit log for academic cycle creation", err));
            return cycle;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error creating academic cycle", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
//# sourceMappingURL=create-academicCycle.usecase.js.map