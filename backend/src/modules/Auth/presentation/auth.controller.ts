import ResponseHttp from "@app/http/response.http.js";
import type { LoginUseCase } from "../application/login.usecase.js";
import type { Request, Response, NextFunction } from "express";
import AppError from "@shared/errors/AppError.js";
import type { RefreshTokenUseCase } from "../application/refresh-token.usecase.js";
import type { GetProfileUseCase } from "../application/get-profile.usecase.js";
import type { LogoutUseCase } from "../application/logout.usecase.js";


const isProduction = process.env.NODE_ENV !== "development";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
}

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken"

export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
        private readonly getProfileUseCase: GetProfileUseCase,
        private readonly logoutUseCase: LogoutUseCase
    ) { }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body

            const { accessToken, refreshToken, user } = await this.loginUseCase.execute({ email, password })

            res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, COOKIE_OPTIONS)

            return res.status(200).json(
                ResponseHttp.success("Login successful", { accessToken, user })
            )
        } catch (error) {
            next(error)
        }
    }

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tokenReceived = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

            if (!tokenReceived) {
                throw new AppError("You must log in again", "MISSING_COOKIE", 401)
            }

            const { accessToken, refreshToken, user } = await this.refreshTokenUseCase.execute(tokenReceived)

            res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, COOKIE_OPTIONS);

            return res.status(200).json(
                ResponseHttp.success("Token renewed", { accessToken, user })
            )

        } catch (error) {
            next(error)
        }
    }

    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userCtx = res.locals.user;
            if (!userCtx) {
                throw new AppError("Unauthenticated user", "UNAUTHORIZED", 401)
            }

            const profile = await this.getProfileUseCase.execute(userCtx.id)

            return res.status(200).json(
                ResponseHttp.success("Profile fetched", profile)
            )
        } catch (error) {
            next(error)
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tokenReceived = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

            if (tokenReceived) {
                await this.logoutUseCase.execute(tokenReceived);
            }

            res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, COOKIE_OPTIONS);

            return res.status(200).json(
                ResponseHttp.success("Logged out successfully", null)
            );
        } catch (error) {
            next(error);
        }
    }
}