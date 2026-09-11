import type { TeacherRepository } from "../domain/teacher.repository.js";
export declare class GetTeacherUseCase {
    private readonly repository;
    constructor(repository: TeacherRepository);
    execute(id: string): Promise<any>;
}
//# sourceMappingURL=get-teacher.usecase.d.ts.map