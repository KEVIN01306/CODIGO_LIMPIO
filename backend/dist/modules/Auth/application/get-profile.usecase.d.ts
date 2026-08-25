import type { AuthRepository } from "../domain/auth.repository.js";
interface GetProfileResponse {
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
}
export declare class GetProfileUseCase {
    private readonly authRepository;
    constructor(authRepository: AuthRepository);
    execute(userId: string): Promise<GetProfileResponse>;
}
export {};
//# sourceMappingURL=get-profile.usecase.d.ts.map