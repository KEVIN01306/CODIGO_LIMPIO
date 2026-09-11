import AppError from "../../../shared/errors/AppError.js";
export class GetTeacherUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const data = await this.repository.findById(id);
        if (!data)
            throw new AppError("Teacher not found", "NOT_FOUND", 404);
        return data;
    }
}
//# sourceMappingURL=get-teacher.usecase.js.map