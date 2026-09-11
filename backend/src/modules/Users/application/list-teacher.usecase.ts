
import type { TeacherRepository } from "../domain/teacher.repository.js";

export class ListTeachersUseCase {
    constructor(private readonly repository: TeacherRepository) {}

    async execute(params: { page: number; perPage: number; q?: string; tenantId: string }) {
        const skip = (params.page - 1) * params.perPage;
        const [total, data] = await this.repository.findAll({
            skip,
            take: params.perPage,
            q: params.q,
            tenantId: params.tenantId
        });
        
        return {
            data,
            meta: {
                total,
                page: params.page,
                perPage: params.perPage,
                totalPages: Math.ceil(total / params.perPage)
            }
        };
    }
}
