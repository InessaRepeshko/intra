import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { QuestionTemplateDomain } from 'src/contexts/library/domain/question-template.domain';

describe('QuestionTemplateDomain', () => {
    const baseProps = {
        title: 'Are you a team player?',
        answerType: AnswerType.NUMERICAL_SCALE,
        competenceId: 7,
    };

    describe('create', () => {
        it('creates a question template with every supplied property', () => {
            const template = QuestionTemplateDomain.create({
                id: 1,
                ...baseProps,
                isForSelfassessment: true,
                status: QuestionTemplateStatus.ARCHIVE,
                positionIds: [10, 11],
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            expect(template.id).toBe(1);
            expect(template.title).toBe('Are you a team player?');
            expect(template.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(template.competenceId).toBe(7);
            expect(template.isForSelfassessment).toBe(true);
            expect(template.status).toBe(QuestionTemplateStatus.ARCHIVE);
            expect(template.positionIds).toEqual([10, 11]);
        });

        it('defaults isForSelfassessment to false, status to ACTIVE, positionIds to []', () => {
            const template = QuestionTemplateDomain.create(baseProps);

            expect(template.isForSelfassessment).toBe(false);
            expect(template.status).toBe(QuestionTemplateStatus.ACTIVE);
            expect(template.positionIds).toEqual([]);
        });

        it('coerces null isForSelfassessment to false', () => {
            const template = QuestionTemplateDomain.create({
                ...baseProps,
                isForSelfassessment: null,
            });

            expect(template.isForSelfassessment).toBe(false);
        });
    });

    describe('withPositions', () => {
        it('returns a new instance carrying the supplied positionIds', () => {
            const template = QuestionTemplateDomain.create({
                ...baseProps,
                positionIds: [1, 2],
            });

            const next = template.withPositions([3, 4, 5]);

            expect(next).not.toBe(template);
            expect(next.positionIds).toEqual([3, 4, 5]);
            expect(template.positionIds).toEqual([1, 2]);
        });
    });
});
