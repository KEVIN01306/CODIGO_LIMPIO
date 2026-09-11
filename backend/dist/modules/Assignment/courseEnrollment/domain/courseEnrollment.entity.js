export class CourseEnrollmentEntity {
    id;
    offeringId;
    studentId;
    status;
    finalGrade;
    enrolledAt;
    offering;
    student;
    constructor(id, offeringId, studentId, status, finalGrade, enrolledAt, offering, student) {
        this.id = id;
        this.offeringId = offeringId;
        this.studentId = studentId;
        this.status = status;
        this.finalGrade = finalGrade;
        this.enrolledAt = enrolledAt;
        this.offering = offering;
        this.student = student;
    }
}
//# sourceMappingURL=courseEnrollment.entity.js.map