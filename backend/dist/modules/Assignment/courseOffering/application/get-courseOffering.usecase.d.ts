import { CourseOfferingRepository } from "../domain/courseOffering.repository.js";
export declare class GetCourseOfferingUseCase {
    private readonly repository;
    constructor(repository: CourseOfferingRepository);
    execute(id: string): Promise<any>;
}
//# sourceMappingURL=get-courseOffering.usecase.d.ts.map