import { CourseOfferingRepository } from "../domain/courseOffering.repository.js";
export declare class ListCourseOfferingsUseCase {
    private readonly repository;
    constructor(repository: CourseOfferingRepository);
    execute(page: number, limit: number, filters?: any): Promise<any>;
}
//# sourceMappingURL=list-courseOffering.usecase.d.ts.map