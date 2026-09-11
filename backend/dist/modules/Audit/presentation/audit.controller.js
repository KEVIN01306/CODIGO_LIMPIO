import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
export class AuditController extends BaseController {
    listAuditLogsUseCase;
    constructor(listAuditLogsUseCase) {
        super();
        this.listAuditLogsUseCase = listAuditLogsUseCase;
    }
    list = async (req, res, next) => {
        try {
            // Uncomment the following line if this endpoint requires the user to be authenticated
            // const userCtx = this.obtenerEntorno(res);
            const logs = await this.listAuditLogsUseCase.execute();
            return res.status(200).json(ResponseHttp.success("Audit logs fetched successfully", logs));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=audit.controller.js.map