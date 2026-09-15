export declare class GetDashboardSummaryUseCase {
    execute(userId: string): Promise<{
        user: {
            firstName: string;
            lastName: string;
            email: string;
            roles: string[];
        };
        tenant: {
            name: string;
            slug: string;
        };
        studentCourses: {
            id: string;
            offeringId: string;
            code: string;
            name: string;
            credits: number;
            cycle: string;
            section: string;
        }[];
        teacherCourses: {
            id: string;
            offeringId: string;
            code: string;
            name: string;
            credits: number;
            cycle: string;
            section: string;
        }[];
    }>;
}
//# sourceMappingURL=get-dashboard-summary.usecase.d.ts.map