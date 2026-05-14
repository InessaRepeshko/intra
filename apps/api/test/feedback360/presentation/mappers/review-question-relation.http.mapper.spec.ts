import { AnswerType } from '@intra/shared-kernel';
import { ReviewQuestionRelationDomain } from 'src/contexts/feedback360/domain/review-question-relation.domain';
import { ReviewQuestionRelationHttpMapper } from 'src/contexts/feedback360/presentation/http/mappers/review-question-relation.http.mapper';

describe('ReviewQuestionRelationHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = ReviewQuestionRelationDomain.create({
                id: 1,
                reviewId: 10,
                questionId: 20,
                questionTitle: 'How effective is teamwork?',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId: 3,
                competenceTitle: 'Teamwork',
                competenceCode: 'TWK',
                competenceDescription: 'Working with peers',
                isForSelfassessment: true,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response =
                ReviewQuestionRelationHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.reviewId).toBe(10);
            expect(response.questionId).toBe(20);
            expect(response.questionTitle).toBe('How effective is teamwork?');
            expect(response.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(response.competenceId).toBe(3);
            expect(response.competenceTitle).toBe('Teamwork');
            expect(response.competenceCode).toBe('TWK');
            expect(response.competenceDescription).toBe('Working with peers');
            expect(response.isForSelfassessment).toBe(true);
        });

        it('returns null for missing competence code/description', () => {
            const domain = ReviewQuestionRelationDomain.create({
                reviewId: 10,
                questionId: 20,
                questionTitle: 'Q',
                answerType: AnswerType.TEXT_FIELD,
                competenceId: 3,
                competenceTitle: 'Teamwork',
            });

            const response =
                ReviewQuestionRelationHttpMapper.toResponse(domain);
            expect(response.competenceCode).toBeNull();
            expect(response.competenceDescription).toBeNull();
        });
    });
});
