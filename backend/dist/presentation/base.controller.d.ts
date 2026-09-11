import type { Response } from 'express';
declare abstract class BaseController {
    constructor();
    /**
     * Returns the context or environment of the current request.
     * Centralizes the security of business data.
     */
    protected obtenerEntorno(res: Response): {
        id: string;
        tenantId: string;
        campusId?: string;
        roles: string[];
        permissions: string[];
    };
}
export default BaseController;
//# sourceMappingURL=base.controller.d.ts.map