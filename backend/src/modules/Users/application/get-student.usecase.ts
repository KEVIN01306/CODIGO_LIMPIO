
import type { StudentRepository } from "../domain/student.repository.js";
import AppError from "@shared/errors/AppError.js";

export class GetStudentUseCase {
    constructor(private readonly repository: StudentRepository) {}

    async execute(id: string) {
        const data = await this.repository.findById(id);
        if (!data) throw new AppError("Student not found", "NOT_FOUND", 404);
        return data;
    }
}
