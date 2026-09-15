import ResponseHttp from "../../../app/http/response.http.js";
import BaseController from "../../../presentation/base.controller.js";
export class TenantController extends BaseController {
    getTenantConfigurationUseCase;
    updateTenantConfigurationUseCase;
    constructor(getTenantConfigurationUseCase, updateTenantConfigurationUseCase) {
        super();
        this.getTenantConfigurationUseCase = getTenantConfigurationUseCase;
        this.updateTenantConfigurationUseCase = updateTenantConfigurationUseCase;
    }
    getConfiguration = async (req, res, next) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const tenantConfig = await this.getTenantConfigurationUseCase.execute(tenantId);
            return res.status(200).json(ResponseHttp.success("Tenant configuration fetched successfully", tenantConfig));
        }
        catch (error) {
            next(error);
        }
    };
    updateConfiguration = async (req, res, next) => {
        try {
            const { tenantId } = this.obtenerEntorno(res);
            const updated = await this.updateTenantConfigurationUseCase.execute(tenantId, req.body);
            return res.status(200).json(ResponseHttp.success("Tenant configuration updated successfully", updated));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=tenant.controller.js.map