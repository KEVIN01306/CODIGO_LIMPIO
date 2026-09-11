import type { StudentRepository } from "../domain/student.repository.js";
export declare class GetStudentUseCase {
    private readonly repository;
    constructor(repository: StudentRepository);
    execute(id: string): Promise<any>;
}
//# sourceMappingURL=get-student.usecase.d.ts.map