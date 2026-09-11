import ResponseHttp from "../../../../app/http/response.http.js";
import BaseController from "../../../../presentation/base.controller.js";
export class CourseOfferingController extends BaseController {
    createUseCase;
    updateUseCase;
    listUseCase;
    getUseCase;
    deleteUseCase;
    constructor(createUseCase, updateUseCase, listUseCase, getUseCase, deleteUseCase) {
        super();
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.listUseCase = listUseCase;
        this.getUseCase = getUseCase;
        this.deleteUseCase = deleteUseCase;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const entity = await this.createUseCase.execute(data);
            return res.status(201).json(ResponseHttp.success("CourseOffering created successfully", entity));
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const entity = await this.updateUseCase.execute(id, data);
            return res.status(200).json(ResponseHttp.success("CourseOffering updated successfully", entity));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const entity = await this.getUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("CourseOffering fetched successfully", entity));
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const offset = parseInt(req.query.offset) || 0;
            const page = Math.floor(offset / limit) + 1;
            const result = await this.listUseCase.execute(page, limit, req.query);
            return res.status(200).json(ResponseHttp.pagination('CourseOfferings retrieved successfully', result.data, result.total, limit, offset));
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params.id;
            await this.deleteUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("CourseOffering deleted successfully", null));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=courseOffering.controller.js.map