import { AnswerType } from '@intra/shared-kernel';
import { ReviewQuestionRelationDomain } from 'src/contexts/feedback360/domain/review-question-relation.domain';

describe('ReviewQuestionRelationDomain', () => {
    const baseProps = {
        reviewId: 1,
        questionId: 2,
        questionTitle: 'How effective is teamwork?',
        answerType: AnswerType.NUMERICAL_SCALE,
        competenceId: 3,
        competenceTitle: 'Teamwork',
    };

    describe('create', () => {
        it('creates a relation with all supplied properties', () => {
            const relation = ReviewQuestionRelationDomain.create({
                id: 10,
                ...baseProps,
                competenceCode: 'TWK',
                competenceDescription: 'Working with peers',
                isForSelfassessment: true,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(relation.id).toBe(10);
            expect(relation.reviewId).toBe(1);
            expect(relation.questionId).toBe(2);
            expect(relation.questionTitle).toBe('How effective is teamwork?');
            expect(relation.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(relation.competenceId).toBe(3);
            expect(relation.competenceTitle).toBe('Teamwork');
            expect(relation.competenceCode).toBe('TWK');
            expect(relation.competenceDescription).toBe('Working with peers');
            expect(relation.isForSelfassessment).toBe(true);
            expect(relation.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('normalises missing competence code/description to null', () => {
            const relation = ReviewQuestionRelationDomain.create(baseProps);
            expect(relation.competenceCode).toBeNull();
            expect(relation.competenceDescription).toBeNull();
        });

        it('defaults isForSelfassessment to false when not provided', () => {
            const relation = ReviewQuestionRelationDomain.create(baseProps);
            expect(relation.isForSelfassessment).toBe(false);
        });
    });
});
