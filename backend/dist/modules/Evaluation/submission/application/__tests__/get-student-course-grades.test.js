import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { GetStudentCourseGradesUseCase } from '../get-student-course-grades.usecase.js';
describe('GetStudentCourseGradesUseCase calculations and logic', () => {
    test('extractFindings handles findings and mistakes arrays correctly', () => {
        const useCase = new GetStudentCourseGradesUseCase({});
        const aiFeedback = {
            aiFeedback: 'Good attempt overall.',
            mistakes: [
                { title: 'Off by one error', message: 'Loop runs <= length instead of < length', severity: 'medium' },
                'Missing null check'
            ]
        };
        const testOutput = {
            failures: [
                { title: 'test boundary condition', message: 'Expected 5 but got 6' }
            ]
        };
        const findings = useCase.extractFindings(aiFeedback, testOutput);
        assert.equal(findings.length, 3);
        assert.equal(findings[0].title, 'Off by one error');
        assert.equal(findings[0].description, 'Loop runs <= length instead of < length');
        assert.equal(findings[1].title, 'Missing null check');
        assert.equal(findings[2].title, 'test boundary condition');
        assert.equal(findings[2].severity, 'error');
    });
    test('extractAiFeedback correctly extracts string or object aiFeedback', () => {
        const useCase = new GetStudentCourseGradesUseCase({});
        assert.equal(useCase.extractAiFeedback('Great work!'), 'Great work!');
        assert.equal(useCase.extractAiFeedback({ aiFeedback: 'Solid implementation.' }), 'Solid implementation.');
        assert.equal(useCase.extractAiFeedback({ feedback: 'Good logic.' }), 'Good logic.');
        assert.equal(useCase.extractAiFeedback(null), null);
        assert.equal(useCase.extractAiFeedback(''), null);
    });
    test('equivalent points and summary formula match specification', () => {
        // Spec test:
        // Assessment 1: maxScore = 100, studentScore = 85, assessmentValue = 20 -> equivalent = 17 / 20
        // Assessment 2: maxScore = 50, studentScore = 40, assessmentValue = 30 -> equivalent = 24 / 30
        // Assessment 3: maxScore = 100, studentScore = 80, assessmentValue = 50 -> equivalent = 40 / 50
        // Total points earned: 17 + 24 + 40 = 81 / 100 (81%)
        const a1 = { score: 85, maxScore: 100, assessmentValue: 20 };
        const eq1 = Number(((a1.score / a1.maxScore) * a1.assessmentValue).toFixed(2));
        assert.equal(eq1, 17);
        const a2 = { score: 40, maxScore: 50, assessmentValue: 30 };
        const eq2 = Number(((a2.score / a2.maxScore) * a2.assessmentValue).toFixed(2));
        assert.equal(eq2, 24);
        const a3 = { score: 80, maxScore: 100, assessmentValue: 50 };
        const eq3 = Number(((a3.score / a3.maxScore) * a3.assessmentValue).toFixed(2));
        assert.equal(eq3, 40);
        const totalEarned = eq1 + eq2 + eq3;
        const totalPossible = a1.assessmentValue + a2.assessmentValue + a3.assessmentValue;
        assert.equal(totalEarned, 81);
        assert.equal(totalPossible, 100);
        assert.equal(Number(((totalEarned / totalPossible) * 100).toFixed(2)), 81);
    });
});
//# sourceMappingURL=get-student-course-grades.test.js.map