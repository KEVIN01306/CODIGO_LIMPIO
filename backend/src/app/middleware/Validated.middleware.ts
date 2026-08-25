import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";
import ResponseHttp from "../http/response.http.js";
import { ParamsDictionary } from 'express-serve-static-core';

export class ValidatedMiddleware {

    public validateBody(schema: ZodTypeAny) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = schema.parse(req.body);
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json(ResponseHttp.validation(error));
                }
                next(error);
            }
        };
    }

    public validateQuery(schema: ZodTypeAny) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                res.locals.query = await schema.parseAsync(req.query);
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json(ResponseHttp.validation(error));
                }
                next(error);
            }
        };
    }

    public validateParams(schema: ZodTypeAny) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                req.params = schema.parse(req.params) as ParamsDictionary;
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json(ResponseHttp.validation(error));
                }
                next(error);
            }
        };
    }
}