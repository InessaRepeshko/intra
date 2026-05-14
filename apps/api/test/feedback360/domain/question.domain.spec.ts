import { AnswerType } from '@intra/shared-kernel';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';

describe('QuestionDomain', () => {
    const baseProps = {
        title: 'Are you a team player?',
        answerType: AnswerType.NUMERICAL_SCALE,
    };

    describe('create', () => {
        it('creates a question with all supplied properties', () => {
            const question = QuestionDomain.create({
                id: 1,
                ...baseProps,
                cycleId: 100,
                questionTemplateId: 50,
                competenceId: 7,
                isForSelfassessment: true,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(question.id).toBe(1);
            expect(question.title).toBe('Are you a team player?');
            expect(question.answerType).toBe(AnswerType.NUMERICAL_SCALE);
            expect(question.cycleId).toBe(100);
            expect(question.questionTemplateId).toBe(50);
            expect(question.competenceId).toBe(7);
            expect(question.isForSelfassessment).toBe(true);
            expect(question.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('normalises missing optional foreign keys to null', () => {
            const question = QuestionDomain.create(baseProps);
            expect(question.cycleId).toBeNull();
            expect(question.questionTemplateId).toBeNull();
            expect(question.competenceId).toBeNull();
        });

        it('defaults isForSelfassessment to false when not provided', () => {
            const question = QuestionDomain.create(baseProps);
            expect(question.isForSelfassessment).toBe(false);
        });

        it('coerces null isForSelfassessment to false', () => {
            const question = QuestionDomain.create({
                ...baseProps,
                isForSelfassessment: null,
            });
            expect(question.isForSelfassessment).toBe(false);
        });
    });
});
