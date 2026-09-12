import type { AuthRepository } from "../domain/auth.repository.js";
export interface StudentProfileInfo {
    studentNumber: string;
    campusName: string;
    cohortName?: string;
    programName?: string;
}
export interface TeacherProfileInfo {
    employeeCode?: string | null;
    campusName: string;
}
export interface GetProfileResponse {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    tenantId: string;
    tenantName: string;
    campusId?: string;
    campusName?: string;
    establishment: string;
    roles: string[];
    isStudent: boolean;
    isTeacher: boolean;
    createdAt: string;
    studentInfo?: StudentProfileInfo | null;
    teacherInfo?: TeacherProfileInfo | null;
}
export declare class GetProfileUseCase {
    private readonly authRepository;
    constructor(authRepository: AuthRepository);
    execute(userId: string): Promise<GetProfileResponse>;
}
//# sourceMappingURL=get-profile.usecase.d.ts.map