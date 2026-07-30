import { AnswerType, RespondentCategory } from '@intra/shared-kernel';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';
import { AnswerHttpMapper } from 'src/contexts/feedback360/presentation/http/mappers/answer.http.mapper';

describe('AnswerHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = AnswerDomain.create({
                id: 1,
                reviewId: 10,
                questionId: 20,
                respondentCategory: RespondentCategory.TEAM,
                answerType: AnswerType.NUMERICAL_SCALE,
                numericalValue: 4,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response = AnswerHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.reviewId).toBe(10);
            expect(response.questionId).toBe(20);
            expect(response.respondentCategory).toBe(RespondentCategory.TEAM);
            expect(response.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(response.numericalValue).toBe(4);
            expect(response.textValue).toBeNull();
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('returns null for missing numerical and text values', () => {
            const domain = AnswerDomain.create({
                reviewId: 10,
                questionId: 20,
                respondentCategory: RespondentCategory.OTHER,
                answerType: AnswerType.TEXT_FIELD,
            });

            const response = AnswerHttpMapper.toResponse(domain);

            expect(response.numericalValue).toBeNull();
            expect(response.textValue).toBeNull();
        });
    });
});
