import ResponseHttp from "../../../app/http/response.http.js";
import BaseController from "../../../presentation/base.controller.js";
export class DashboardController extends BaseController {
    getDashboardSummaryUseCase;
    constructor(getDashboardSummaryUseCase) {
        super();
        this.getDashboardSummaryUseCase = getDashboardSummaryUseCase;
    }
    summary = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const summary = await this.getDashboardSummaryUseCase.execute(userId);
            return res.status(200).json(ResponseHttp.success("Dashboard summary fetched successfully", summary));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=dashboard.controller.js.map