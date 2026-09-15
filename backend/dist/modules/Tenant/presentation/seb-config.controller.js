import ResponseHttp from "../../../app/http/response.http.js";
import BaseController from "../../../presentation/base.controller.js";
export class SebConfigController extends BaseController {
    getSebConfigUseCase;
    updateSebConfigUseCase;
    constructor(getSebConfigUseCase, updateSebConfigUseCase) {
        super();
        this.getSebConfigUseCase = getSebConfigUseCase;
        this.updateSebConfigUseCase = updateSebConfigUseCase;
    }
    getSebConfig = async (req, res, next) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const sebConfig = await this.getSebConfigUseCase.execute(tenantId);
            return res.status(200).json(ResponseHttp.success("SEB configuration fetched successfully", sebConfig));
        }
        catch (error) {
            next(error);
        }
    };
    updateSebConfig = async (req, res, next) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const updated = await this.updateSebConfigUseCase.execute(tenantId, req.body.defaultSebConfigKey ?? null);
            return res.status(200).json(ResponseHttp.success("SEB configuration updated successfully", updated));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=seb-config.controller.js.map