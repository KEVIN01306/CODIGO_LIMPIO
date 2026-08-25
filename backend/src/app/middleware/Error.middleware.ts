import type { NextFunction, Request, Response } from "express";
import ResponseHttp from "../http/response.http.js";

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let code = err.code || 'INTERNAL_SERVER_ERROR';
    let message = err.message || 'Error interno del servidor';
    console.log(err)
    res.status(statusCode).json(
        ResponseHttp.error(message, code)
    );
}