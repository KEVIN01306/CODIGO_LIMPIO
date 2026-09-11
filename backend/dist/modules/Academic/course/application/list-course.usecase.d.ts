import type { CoursesRepository, CourseFilters } from "../../course/domain/course.repository.js";
import type { GetSimpleCourse } from "../../course/domain/course.entity.js";
export declare class ListCoursesUseCase {
    private readonly coursesRepository;
    constructor(coursesRepository: CoursesRepository);
    execute(page: number, perPage: number, filters: CourseFilters): Promise<{
        total: number;
        data: GetSimpleCourse[];
    }>;
}
//# sourceMappingURL=list-course.usecase.d.ts.map