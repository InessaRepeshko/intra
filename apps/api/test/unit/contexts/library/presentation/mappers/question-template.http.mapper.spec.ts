import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { QuestionTemplateDomain } from 'src/contexts/library/domain/question-template.domain';
import { QuestionTemplateHttpMapper } from 'src/contexts/library/presentation/http/mappers/question-template.http.mapper';

describe('QuestionTemplateHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = QuestionTemplateDomain.create({
                id: 1,
                competenceId: 7,
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
                isForSelfassessment: true,
                status: QuestionTemplateStatus.ACTIVE,
                positionIds: [10, 11],
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            const response = QuestionTemplateHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.competenceId).toBe(7);
            expect(response.title).toBe('Q?');
            expect(response.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(response.isForSelfassessment).toBe(true);
            expect(response.status).toBe(QuestionTemplateStatus.ACTIVE);
            expect(response.positionIds).toEqual([10, 11]);
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(response.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });
    });
});
