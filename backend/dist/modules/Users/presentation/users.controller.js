import ResponseHttp from "@app/http/response.http.js";
import BaseController from "@presentation/base.controller.js";
export class UsersController extends BaseController {
    createUserUseCase;
    updateUserUseCase;
    listUsersUseCase;
    disableUserUseCase;
    deleteUserUseCase;
    hashProvider;
    constructor(createUserUseCase, updateUserUseCase, listUsersUseCase, disableUserUseCase, deleteUserUseCase, hashProvider) {
        super();
        this.createUserUseCase = createUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.listUsersUseCase = listUsersUseCase;
        this.disableUserUseCase = disableUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.hashProvider = hashProvider;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const tenantId = req.user.tenantId;
            const user = await this.createUserUseCase.execute({ ...data, tenantId });
            return res.status(201).json(ResponseHttp.success("User created successfully", user));
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const id = req.params.id;
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
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const users = await this.listUsersUseCase.execute();
            return res.status(200).json(ResponseHttp.success("Users fetched successfully", users));
        }
        catch (error) {
            next(error);
        }
    };
    disable = async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = await this.disableUserUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("User disabled successfully", user));
        }
        catch (error) {
            next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = await this.deleteUserUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("User deleted successfully", user));
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=users.controller.js.map