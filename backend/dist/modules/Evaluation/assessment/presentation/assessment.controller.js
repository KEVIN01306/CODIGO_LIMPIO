import ResponseHttp from "../../../../app/http/response.http.js";
import BaseController from "../../../../presentation/base.controller.js";
export class AssessmentController extends BaseController {
    createUseCase;
    updateUseCase;
    getUseCase;
    listUseCase;
    deleteUseCase;
    constructor(createUseCase, updateUseCase, getUseCase, listUseCase, deleteUseCase) {
        super();
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.getUseCase = getUseCase;
        this.listUseCase = listUseCase;
        this.deleteUseCase = deleteUseCase;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const entity = await this.createUseCase.execute(data);
            return res.status(201).json(ResponseHttp.success("Assessment created successfully", entity));
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
            return res.status(200).json(ResponseHttp.success("Assessment updated successfully", entity));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const entity = await this.getUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("Assessment fetched successfully", entity));
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
            return res.status(200).json(ResponseHttp.pagination('Assessments retrieved successfully', result.data, result.total, limit, offset));
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params.id;
            await this.deleteUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("Assessment deleted successfully", null));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=assessment.controller.js.map