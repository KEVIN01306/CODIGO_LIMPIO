import type { TeacherRepository } from "../domain/teacher.repository.js";
export declare class ListTeachersUseCase {
    private readonly repository;
    constructor(repository: TeacherRepository);
    execute(params: {
        page: number;
        perPage: number;
        q?: string;
        tenantId: string;
    }): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
        };
    }>;
}
//# sourceMappingURL=list-teacher.usecase.d.ts.map