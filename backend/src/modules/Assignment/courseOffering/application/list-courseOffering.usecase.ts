import { CourseOfferingRepository } from "../domain/courseOffering.repository.js";
import AppError from "../../../../shared/errors/AppError.js";

export class ListCourseOfferingsUseCase {
    constructor(
        private readonly repository: CourseOfferingRepository
    ) {}

    async execute(page: number, limit: number, filters?: any): Promise<any> {
        return await this.repository.findAll(page, limit, filters);
    }
}
