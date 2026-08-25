import AppError from '../shared/errors/AppError.js';
class BaseController {
    constructor() { }
    /**
     * Returns the context or environment of the current request.
     * Centralizes the security of business data.
     */
    obtenerEntorno(res) {
        if (!res.locals.user) {
            throw new AppError("Unable to determine the context of the request", "CONTEXT_NOT_FOUND", 403);
        }
        return res.locals.user;
    }
}
export default BaseController;
//# sourceMappingURL=base.controller.js.map