export interface CourseSummary {
    id: string;
    offeringId?: string;
    code: string;
    name: string;
    credits: number;
    cycle: string;
    section: string;
}

export interface DashboardSummary {
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
    studentCourses: CourseSummary[];
    teacherCourses: CourseSummary[];
}
