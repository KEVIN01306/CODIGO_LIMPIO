import ResponseHttp from "../../../app/http/response.http.js";
import BaseController from "../../../presentation/base.controller.js";
export class RolesController extends BaseController {
    getRolesMatrixUseCase;
    constructor(getRolesMatrixUseCase) {
        super();
        this.getRolesMatrixUseCase = getRolesMatrixUseCase;
    }
    getMatrix = async (req, res, next) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const matrix = await this.getRolesMatrixUseCase.execute(tenantId);
            res.status(200).json(ResponseHttp.success("Roles and permissions matrix fetched successfully", matrix));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=roles.controller.js.map