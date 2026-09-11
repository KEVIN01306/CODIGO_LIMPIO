import type { StudentRepository } from "../domain/student.repository.js";
export declare class ListStudentsUseCase {
    private readonly repository;
    constructor(repository: StudentRepository);
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
//# sourceMappingURL=list-student.usecase.d.ts.map