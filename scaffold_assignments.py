import os

base_dir = "backend/src/modules/Assignment"
models = [
    {
        "name": "CourseOffering",
        "lower": "courseOffering",
        "plural": "CourseOfferings",
        "plural_lower": "courseOfferings",
        "table": "courseOffering"
    },
    {
        "name": "CourseEnrollment",
        "lower": "courseEnrollment",
        "plural": "CourseEnrollments",
        "plural_lower": "courseEnrollments",
        "table": "courseEnrollment"
    }
]

for model in models:
    mod_dir = os.path.join(base_dir, model["lower"])
    domain_dir = os.path.join(mod_dir, "domain")
    infra_dir = os.path.join(mod_dir, "infrastructure")
    app_dir = os.path.join(mod_dir, "application")
    pres_dir = os.path.join(mod_dir, "presentation")
    
    os.makedirs(domain_dir, exist_ok=True)
    os.makedirs(infra_dir, exist_ok=True)
    os.makedirs(app_dir, exist_ok=True)
    os.makedirs(pres_dir, exist_ok=True)

    # 1. domain/{lower}.entity.ts
    with open(os.path.join(domain_dir, f"{model['lower']}.entity.ts"), "w") as f:
        f.write(f"""export class {model['name']}Entity {{
    constructor(
        public readonly id: string,
        // Add fields
    ) {{}}
}}
""")

    # 2. domain/{lower}.repository.ts
    with open(os.path.join(domain_dir, f"{model['lower']}.repository.ts"), "w") as f:
        f.write(f"""import {{ {model['name']}Entity }} from "./{model['lower']}.entity.js";

export interface {model['name']}Repository {{
    create(data: any): Promise<{model['name']}Entity>;
    update(id: string, data: any): Promise<{model['name']}Entity | null>;
    findById(id: string): Promise<{model['name']}Entity | null>;
    findAll(page: number, limit: number, filters?: any): Promise<{{ data: {model['name']}Entity[], total: number }}>;
    delete(id: string): Promise<void>;
}}
""")

    # 3. application/create-{lower}.usecase.ts
    with open(os.path.join(app_dir, f"create-{model['lower']}.usecase.ts"), "w") as f:
        f.write(f"""import {{ {model['name']}Repository }} from "../domain/{model['lower']}.repository.js";
import {{ CreateAuditLogUseCase }} from "../../../Audit/application/create-auditLog.usecase.js";
import AppError from "../../../../shared/errors/AppError.js";

export class Create{model['name']}UseCase {{
    constructor(
        private readonly repository: {model['name']}Repository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) {{}}

    async execute(data: any): Promise<any> {{
        const entity = await this.repository.create(data);
        return entity;
    }}
}}
""")

    # 4. application/update-{lower}.usecase.ts
    with open(os.path.join(app_dir, f"update-{model['lower']}.usecase.ts"), "w") as f:
        f.write(f"""import {{ {model['name']}Repository }} from "../domain/{model['lower']}.repository.js";
import {{ CreateAuditLogUseCase }} from "../../../Audit/application/create-auditLog.usecase.js";
import AppError from "../../../../shared/errors/AppError.js";

export class Update{model['name']}UseCase {{
    constructor(
        private readonly repository: {model['name']}Repository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) {{}}

    async execute(id: string, data: any): Promise<any> {{
        const entity = await this.repository.update(id, data);
        return entity;
    }}
}}
""")

    # 5. application/get-{lower}.usecase.ts
    with open(os.path.join(app_dir, f"get-{model['lower']}.usecase.ts"), "w") as f:
        f.write(f"""import {{ {model['name']}Repository }} from "../domain/{model['lower']}.repository.js";
import AppError from "../../../../shared/errors/AppError.js";

export class Get{model['name']}UseCase {{
    constructor(
        private readonly repository: {model['name']}Repository
    ) {{}}

    async execute(id: string): Promise<any> {{
        const entity = await this.repository.findById(id);
        if (!entity) throw new AppError('{model['name']} not found', 404);
        return entity;
    }}
}}
""")

    # 6. application/list-{lower}.usecase.ts
    with open(os.path.join(app_dir, f"list-{model['lower']}.usecase.ts"), "w") as f:
        f.write(f"""import {{ {model['name']}Repository }} from "../domain/{model['lower']}.repository.js";
import AppError from "../../../../shared/errors/AppError.js";

export class List{model['plural']}UseCase {{
    constructor(
        private readonly repository: {model['name']}Repository
    ) {{}}

    async execute(page: number, limit: number, filters?: any): Promise<any> {{
        return await this.repository.findAll(page, limit, filters);
    }}
}}
""")

    # 7. application/delete-{lower}.usecase.ts
    with open(os.path.join(app_dir, f"delete-{model['lower']}.usecase.ts"), "w") as f:
        f.write(f"""import {{ {model['name']}Repository }} from "../domain/{model['lower']}.repository.js";
import {{ CreateAuditLogUseCase }} from "../../../Audit/application/create-auditLog.usecase.js";
import AppError from "../../../../shared/errors/AppError.js";

export class Delete{model['name']}UseCase {{
    constructor(
        private readonly repository: {model['name']}Repository,
        private readonly createAuditLogUseCase: CreateAuditLogUseCase
    ) {{}}

    async execute(id: string): Promise<void> {{
        await this.repository.delete(id);
    }}
}}
""")

    # 8. presentation/{lower}.controller.ts
    with open(os.path.join(pres_dir, f"{model['lower']}.controller.ts"), "w") as f:
        f.write(f"""import type {{ Request, Response, NextFunction }} from "express";
import ResponseHttp from "../../../../http/response.http.js";
import BaseController from "../../../../presentation/base.controller.js";
import type {{ Create{model['name']}UseCase }} from "../application/create-{model['lower']}.usecase.js";
import type {{ Update{model['name']}UseCase }} from "../application/update-{model['lower']}.usecase.js";
import type {{ List{model['plural']}UseCase }} from "../application/list-{model['lower']}.usecase.js";
import type {{ Get{model['name']}UseCase }} from "../application/get-{model['lower']}.usecase.js";
import type {{ Delete{model['name']}UseCase }} from "../application/delete-{model['lower']}.usecase.js";

export class {model['name']}Controller extends BaseController {{
    constructor(
        private readonly createUseCase: Create{model['name']}UseCase,
        private readonly updateUseCase: Update{model['name']}UseCase,
        private readonly listUseCase: List{model['plural']}UseCase,
        private readonly getUseCase: Get{model['name']}UseCase,
        private readonly deleteUseCase: Delete{model['name']}UseCase
    ) {{ super(); }}

    create = async (req: Request, res: Response, next: NextFunction) => {{
        try {{
            const data = req.body;
            const entity = await this.createUseCase.execute(data);
            return res.status(201).json(ResponseHttp.success("{model['name']} created successfully", entity));
        }} catch (error) {{ next(error); }}
    }}

    update = async (req: Request, res: Response, next: NextFunction) => {{
        try {{
            const id = req.params.id as string;
            const data = req.body;
            const entity = await this.updateUseCase.execute(id, data);
            return res.status(200).json(ResponseHttp.success("{model['name']} updated successfully", entity));
        }} catch (error) {{ next(error); }}
    }}

    getById = async (req: Request, res: Response, next: NextFunction) => {{
        try {{
            const id = req.params.id as string;
            const entity = await this.getUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("{model['name']} fetched successfully", entity));
        }} catch (error) {{ next(error); }}
    }}

    list = async (req: Request, res: Response, next: NextFunction) => {{
        try {{
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const page = Math.floor(offset / limit) + 1;
            
            const result = await this.listUseCase.execute(page, limit, req.query);
            return res.status(200).json(
                ResponseHttp.pagination('{model['plural']} retrieved successfully', result.data, result.total, limit, offset)
            );
        }} catch (error) {{ next(error); }}
    }}

    delete = async (req: Request, res: Response, next: NextFunction) => {{
        try {{
            const id = req.params.id as string;
            await this.deleteUseCase.execute(id);
            return res.status(200).json(ResponseHttp.success("{model['name']} deleted successfully", null));
        }} catch (error) {{ next(error); }}
    }}
}}
""")

print("Scaffolding created.")
