import ResponseHttp from "../../../../app/http/response.http.js";
import BaseController from "../../../../presentation/base.controller.js";
export class CampusController extends BaseController {
    createCampusUseCase;
    updateCampusUseCase;
    listCampusesUseCase;
    getCampusUseCase;
    deleteCampusUseCase;
    constructor(createCampusUseCase, updateCampusUseCase, listCampusesUseCase, getCampusUseCase, deleteCampusUseCase) {
        super();
        this.createCampusUseCase = createCampusUseCase;
        this.updateCampusUseCase = updateCampusUseCase;
        this.listCampusesUseCase = listCampusesUseCase;
        this.getCampusUseCase = getCampusUseCase;
        this.deleteCampusUseCase = deleteCampusUseCase;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const tenantId = req.user.tenantId;
            const campus = await this.createCampusUseCase.execute({ ...data, tenantId });
            return res.status(201).json(ResponseHttp.success("Campus created successfully", campus));
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
            const campus = await this.updateCampusUseCase.execute(id, data, tenantId);
            return res.status(200).json(ResponseHttp.success("Campus updated successfully", campus));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const tenantId = req.user.tenantId;
            const campus = await this.getCampusUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Campus fetched successfully", campus));
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
            const isActiveParam = req.query.isActive;
            const isActive = isActiveParam === 'true' ? true : (isActiveParam === 'false' ? false : undefined);
            const page = Math.floor(offset / limit) + 1;
            const filters = { tenantId, q, isActive };
            const result = await this.listCampusesUseCase.execute(page, limit, filters);
            return res.status(200).json(ResponseHttp.pagination('Campuses retrieved successfully', result.data, result.total, limit, offset));
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params.id;
            const tenantId = req.user.tenantId;
            await this.deleteCampusUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Campus deleted successfully", null));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=campus.controller.js.map