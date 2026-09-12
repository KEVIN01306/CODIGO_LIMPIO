import AppError from "@shared/errors/AppError.js";
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

export class GetProfileUseCase {
    constructor(
        private readonly authRepository: AuthRepository
    ) { }

    async execute(userId: string): Promise<GetProfileResponse> {
        const user = await this.authRepository.getDetailedProfile(userId);

        if (!user) {
            throw new AppError("User not found", "NOT_FOUND", 404);
        }

        const campus = user.student?.campus || user.teacher?.campus;
        const establishment = campus?.name || user.tenant?.name || "No especificado";

        const roles: string[] = user.userRoles?.map((ur: any) => ur.role?.name) || [];

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            tenantId: user.tenantId,
            tenantName: user.tenant?.name || "Institución",
            campusId: campus?.id,
            campusName: campus?.name,
            establishment,
            roles,
            isStudent: !!user.student,
            isTeacher: !!user.teacher,
            createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
            studentInfo: user.student ? {
                studentNumber: user.student.studentNumber,
                campusName: user.student.campus?.name || "Campus Principal",
                cohortName: user.student.cohort?.name,
                programName: user.student.cohort?.program?.name,
            } : null,
            teacherInfo: user.teacher ? {
                employeeCode: user.teacher.employeeCode,
                campusName: user.teacher.campus?.name || "Campus Principal",
            } : null,
        };
    }
}
