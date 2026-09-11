import AppError from "../../../shared/errors/AppError.js";
export class GetStudentUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const data = await this.repository.findById(id);
        if (!data)
            throw new AppError("Student not found", "NOT_FOUND", 404);
        return data;
    }
}
//# sourceMappingURL=get-student.usecase.js.map