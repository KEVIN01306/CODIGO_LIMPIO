
import type { TeacherRepository } from "../domain/teacher.repository.js";
import AppError from "@shared/errors/AppError.js";

export class GetTeacherUseCase {
    constructor(private readonly repository: TeacherRepository) {}

    async execute(id: string) {
        const data = await this.repository.findById(id);
        if (!data) throw new AppError("Teacher not found", "NOT_FOUND", 404);
        return data;
    }
}
