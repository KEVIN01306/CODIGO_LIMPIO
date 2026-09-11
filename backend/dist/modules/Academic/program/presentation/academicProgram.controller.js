import ResponseHttp from "../../../../app/http/response.http.js";
import BaseController from "../../../../presentation/base.controller.js";
export class AcademicProgramController extends BaseController {
    createAcademicProgramUseCase;
    updateAcademicProgramUseCase;
    listAcademicProgramsUseCase;
    getAcademicProgramUseCase;
    deleteAcademicProgramUseCase;
    constructor(createAcademicProgramUseCase, updateAcademicProgramUseCase, listAcademicProgramsUseCase, getAcademicProgramUseCase, deleteAcademicProgramUseCase) {
        super();
        this.createAcademicProgramUseCase = createAcademicProgramUseCase;
        this.updateAcademicProgramUseCase = updateAcademicProgramUseCase;
        this.listAcademicProgramsUseCase = listAcademicProgramsUseCase;
        this.getAcademicProgramUseCase = getAcademicProgramUseCase;
        this.deleteAcademicProgramUseCase = deleteAcademicProgramUseCase;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const tenantId = req.user.tenantId;
            const program = await this.createAcademicProgramUseCase.execute({ ...data, tenantId });
            return res.status(201).json(ResponseHttp.success("Academic program created successfully", program));
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
            const program = await this.updateAcademicProgramUseCase.execute(id, data, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic program updated successfully", program));
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const tenantId = req.user.tenantId;
            const program = await this.getAcademicProgramUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic program fetched successfully", program));
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
            const page = Math.floor(offset / limit) + 1;
            const filters = { tenantId, q };
            const result = await this.listAcademicProgramsUseCase.execute(page, limit, filters);
            return res.status(200).json(ResponseHttp.pagination('Academic programs retrieved successfully', result.data, result.total, limit, offset));
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params.id;
            const tenantId = req.user.tenantId;
            await this.deleteAcademicProgramUseCase.execute(id, tenantId);
            return res.status(200).json(ResponseHttp.success("Academic program deleted successfully", null));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=academicProgram.controller.js.map