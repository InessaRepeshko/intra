import { AnswerType, RespondentCategory } from '@intra/shared-kernel';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';

describe('AnswerDomain', () => {
    const baseProps = {
        reviewId: 10,
        questionId: 20,
        respondentCategory: RespondentCategory.TEAM,
        answerType: AnswerType.NUMERICAL_SCALE,
    };

    describe('create', () => {
        it('creates a numerical answer with all properties set', () => {
            const answer = AnswerDomain.create({
                id: 1,
                ...baseProps,
                numericalValue: 4,
                textValue: null,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(answer.id).toBe(1);
            expect(answer.reviewId).toBe(10);
            expect(answer.questionId).toBe(20);
            expect(answer.respondentCategory).toBe(RespondentCategory.TEAM);
            expect(answer.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(answer.numericalValue).toBe(4);
            expect(answer.textValue).toBeNull();
            expect(answer.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('creates a text answer with all properties set', () => {
            const answer = AnswerDomain.create({
                ...baseProps,
                answerType: AnswerType.TEXT_FIELD,
                textValue: 'Great teammate',
            });

            expect(answer.answerType).toBe(AnswerType.TEXT_FIELD);
            expect(answer.textValue).toBe('Great teammate');
            expect(answer.numericalValue).toBeNull();
        });

        it('defaults numericalValue and textValue to null when missing', () => {
            const answer = AnswerDomain.create(baseProps);

            expect(answer.numericalValue).toBeNull();
            expect(answer.textValue).toBeNull();
        });

        it('omits id and createdAt when not provided', () => {
            const answer = AnswerDomain.create(baseProps);
            expect(answer.id).toBeUndefined();
            expect(answer.createdAt).toBeUndefined();
        });
    });
});
