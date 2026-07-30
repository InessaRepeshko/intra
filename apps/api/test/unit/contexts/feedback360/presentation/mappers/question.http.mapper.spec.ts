import { AnswerType } from '@intra/shared-kernel';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { QuestionHttpMapper } from 'src/contexts/feedback360/presentation/http/mappers/question.http.mapper';

describe('QuestionHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = QuestionDomain.create({
                id: 1,
                cycleId: 100,
                questionTemplateId: 50,
                title: 'How is teamwork?',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId: 7,
                isForSelfassessment: true,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response = QuestionHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.cycleId).toBe(100);
            expect(response.questionTemplateId).toBe(50);
            expect(response.title).toBe('How is teamwork?');
            expect(response.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(response.competenceId).toBe(7);
            expect(response.isForSelfassessment).toBe(true);
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('returns null for missing foreign keys', () => {
            const domain = QuestionDomain.create({
                id: 2,
                title: 'q',
                answerType: AnswerType.TEXT_FIELD,
            });

            const response = QuestionHttpMapper.toResponse(domain);

            expect(response.cycleId).toBeNull();
            expect(response.questionTemplateId).toBeNull();
            expect(response.competenceId).toBeNull();
        });
    });
});
