import ResponseHttp from "../../../../app/http/response.http.js";
import BaseController from "../../../../presentation/base.controller.js";
export class AcademicCycleController extends BaseController {
    createAcademicCycleUseCase;
    updateAcademicCycleUseCase;
    listAcademicCyclesUseCase;
    getAcademicCycleUseCase;
    deleteAcademicCycleUseCase;
    constructor(createAcademicCycleUseCase, updateAcademicCycleUseCase, listAcademicCyclesUseCase, getAcademicCycleUseCase, deleteAcademicCycleUseCase) {
        super();
        this.createAcademicCycleUseCase = createAcademicCycleUseCase;
        this.updateAcademicCycleUseCase = updateAcademicCycleUseCase;
        this.listAcademicCyclesUseCase = listAcademicCyclesUseCase;
        this.getAcademicCycleUseCase = getAcademicCycleUseCase;
        this.deleteAcademicCycleUseCase = deleteAcademicCycleUseCase;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const tenantId = req.user.tenantId;
            const cycle = await this.createAcademicCycleUseCase.execute({ ...data, tenantId });
            return res.status(201).json(ResponseHttp.success("Academic cycle created successfully", cycle));
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
            const cycle = await this.updateAcademicCycleUseCase.execute(id, data, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic cycle updated successfully", cycle));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const tenantId = req.user.tenantId;
            const cycle = await this.getAcademicCycleUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic cycle fetched successfully", cycle));
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
            const page = Math.floor(offset / limit) + 1;
            const filters = { tenantId, q, campusId };
            const result = await this.listAcademicCyclesUseCase.execute(page, limit, filters);
            return res.status(200).json(ResponseHttp.pagination('Academic cycles retrieved successfully', result.data, result.total, limit, offset));
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params.id;
            const tenantId = req.user.tenantId;
            await this.deleteAcademicCycleUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic cycle deleted successfully", null));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=academicCycle.controller.js.map