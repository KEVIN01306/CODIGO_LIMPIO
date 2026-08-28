import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
import type { CreateUserUseCase } from "../application/create-user.usecase.js";
import type { UpdateUserUseCase } from "../application/update-user.usecase.js";
import type { ListUsersUseCase } from "../application/list-users.usecase.js";
import type { DisableUserUseCase } from "../application/disable-user.usecase.js";
import type { DeleteUserUseCase } from "../application/delete-user.usecase.js";
import type { HashProvider } from "@shared/domain/hash.provider.js";

export class UsersController extends BaseController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly listUsersUseCase: ListUsersUseCase,
        private readonly disableUserUseCase: DisableUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
        private readonly hashProvider: HashProvider
    ) {
        super();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const user = await this.createUserUseCase.execute(data);
            return res.status(201).json(ResponseHttp.success("User created successfully", user));
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const data = req.body;
            
            let passwordHash = undefined;
            if (data.passwordRaw) {
                passwordHash = await this.hashProvider.hash(data.passwordRaw);
            }

            const updateData = {
                ...data,
                passwordHash
            };

            const user = await this.updateUserUseCase.execute(id, updateData);
            return res.status(200).json(ResponseHttp.success("User updated successfully", user));
        } catch (error) {
            next(error);
        }
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.listUsersUseCase.execute();
            return res.status(200).json(ResponseHttp.success("Users fetched successfully", users));
        } catch (error) {
            next(error);
        }
    }

    disable = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const user = await this.disableUserUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("User disabled successfully", user));
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const user = await this.deleteUserUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("User deleted successfully", user));
        } catch (error) {
            next(error);
        }
    }
}
