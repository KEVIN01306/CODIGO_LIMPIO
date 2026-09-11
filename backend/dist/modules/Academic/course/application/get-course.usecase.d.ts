import type { CoursesRepository } from "../../course/domain/course.repository.js";
import type { GetCourse } from "../../course/domain/course.entity.js";
export declare class GetCourseUseCase {
    private readonly coursesRepository;
    constructor(coursesRepository: CoursesRepository);
    execute(id: string, tenantId: string): Promise<GetCourse>;
}
//# sourceMappingURL=get-course.usecase.d.ts.map