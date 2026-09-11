import type { CampusesRepository, CampusFilters } from "../../campus/domain/campus.repository.js";
import type { GetSimpleCampus } from "../../campus/domain/campus.entity.js";
import AppError from "@shared/errors/AppError.js";

export class ListCampusesUseCase {
    constructor(private readonly campusesRepository: CampusesRepository) { }

    async execute(page: number, perPage: number, filters: CampusFilters): Promise<{ total: number, data: GetSimpleCampus[] }> {
        try {
            return await this.campusesRepository.findAll(page, perPage, filters);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Error fetching campuses", "INTERNAL_SERVER_ERROR", 500);
        }
    }
}
