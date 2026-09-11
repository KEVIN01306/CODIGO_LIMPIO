export class SubmissionEntity {
    id;
    assessmentId;
    studentId;
    status;
    startedAt;
    submittedAt;
    tabSwitchesCount;
    clipboardAttempts;
    codeSnapshot;
    assessment;
    student;
    constructor(id, assessmentId, studentId, status, startedAt, submittedAt, tabSwitchesCount, clipboardAttempts, codeSnapshot, assessment, student) {
        this.id = id;
        this.assessmentId = assessmentId;
        this.studentId = studentId;
        this.status = status;
        this.startedAt = startedAt;
        this.submittedAt = submittedAt;
        this.tabSwitchesCount = tabSwitchesCount;
        this.clipboardAttempts = clipboardAttempts;
        this.codeSnapshot = codeSnapshot;
        this.assessment = assessment;
        this.student = student;
    }
}
//# sourceMappingURL=submission.entity.js.map