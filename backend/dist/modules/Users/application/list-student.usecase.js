export class ListStudentsUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(params) {
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
//# sourceMappingURL=list-student.usecase.js.map