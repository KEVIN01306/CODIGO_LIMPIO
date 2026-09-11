import { CourseOfferingRepository } from "../domain/courseOffering.repository.js";
import AppError from "../../../../shared/errors/AppError.js";

export class GetCourseOfferingUseCase {
    constructor(
        private readonly repository: CourseOfferingRepository
    ) { }

    async execute(id: string): Promise<any> {
        const entity = await this.repository.findById(id);
        if (!entity) throw new AppError('CourseOffering not found', 'NOT_FOUND', 404);
        return entity;
    }
}
