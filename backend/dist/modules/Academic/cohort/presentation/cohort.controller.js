import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
export class CohortController extends BaseController {
    createCohortUseCase;
    updateCohortUseCase;
    listCohortsUseCase;
    getCohortUseCase;
    deleteCohortUseCase;
    constructor(createCohortUseCase, updateCohortUseCase, listCohortsUseCase, getCohortUseCase, deleteCohortUseCase) {
        super();
        this.createCohortUseCase = createCohortUseCase;
        this.updateCohortUseCase = updateCohortUseCase;
        this.listCohortsUseCase = listCohortsUseCase;
        this.getCohortUseCase = getCohortUseCase;
        this.deleteCohortUseCase = deleteCohortUseCase;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const tenantId = req.user.tenantId;
            const cohort = await this.createCohortUseCase.execute({ ...data, tenantId });
            return res.status(201).json(ResponseHttp.success("Cohort created successfully", cohort));
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const tenantId = req.user.tenantId;
            const cohort = await this.updateCohortUseCase.execute(id, data, tenantId);
            return res.status(200).json(ResponseHttp.success("Cohort updated successfully", cohort));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const tenantId = req.user.tenantId;
            const cohort = await this.getCohortUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Cohort fetched successfully", cohort));
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const tenantId = req.user.tenantId;
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const q = req.query.q?.trim();
            const campusId = req.query.campusId;
            const programId = req.query.programId;
            const page = Math.floor(offset / limit) + 1;
            const filters = { tenantId, q, campusId, programId };
            const result = await this.listCohortsUseCase.execute(page, limit, filters);
            return res.status(200).json(ResponseHttp.pagination('Cohorts retrieved successfully', result.data, result.total, limit, offset));
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params.id;
            const tenantId = req.user.tenantId;
            await this.deleteCohortUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Cohort deleted successfully", null));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=cohort.controller.js.map