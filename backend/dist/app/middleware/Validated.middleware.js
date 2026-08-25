import { ZodError } from "zod";
import ResponseHttp from "../http/response.http.js";
export class ValidatedMiddleware {
    validateBody(schema) {
        return (req, res, next) => {
            try {
                req.body = schema.parse(req.body);
                next();
            }
            catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json(ResponseHttp.validation(error));
                }
                next(error);
            }
        };
    }
    validateQuery(schema) {
        return async (req, res, next) => {
            try {
                res.locals.query = await schema.parseAsync(req.query);
                next();
            }
            catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json(ResponseHttp.validation(error));
                }
                next(error);
            }
        };
    }
    validateParams(schema) {
        return (req, res, next) => {
            try {
                req.params = schema.parse(req.params);
                next();
            }
            catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json(ResponseHttp.validation(error));
                }
                next(error);
            }
        };
    }
}
//# sourceMappingURL=Validated.middleware.js.map