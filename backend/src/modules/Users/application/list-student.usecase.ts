
import type { StudentRepository } from "../domain/student.repository.js";

export class ListStudentsUseCase {
    constructor(private readonly repository: StudentRepository) {}

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
