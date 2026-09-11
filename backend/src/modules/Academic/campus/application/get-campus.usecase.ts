import type { CampusesRepository } from "../../campus/domain/campus.repository.js";
import type { GetCampus } from "../../campus/domain/campus.entity.js";
import AppError from "@shared/errors/AppError.js";

export class GetCampusUseCase {
    constructor(private readonly campusesRepository: CampusesRepository) { }

    async execute(id: string, tenantId: string): Promise<GetCampus> {
        try {
            const campus = await this.campusesRepository.findById(id);
            if (!campus || campus.tenantId !== tenantId) {
                throw new AppError("Campus not found", "NOT_FOUND", 404);
            }
            return campus;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching campus", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
