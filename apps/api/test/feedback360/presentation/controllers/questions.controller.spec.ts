jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import { AnswerType } from '@intra/shared-kernel';
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { QuestionsController } from 'src/contexts/feedback360/presentation/http/controllers/questions.controller';

describe('QuestionsController', () => {
    let controller: QuestionsController;
    let reviews: any;

    beforeEach(() => {
        reviews = {
            createQuestion: jest.fn(),
            listQuestions: jest.fn(),
            deleteQuestion: jest.fn(),
        };

        controller = new QuestionsController(
            reviews as unknown as ReviewService,
        );
    });

    describe('create', () => {
        it('maps the result to a response', async () => {
            reviews.createQuestion.mockResolvedValue(
                QuestionDomain.create({
                    id: 1,
                    title: 'Q',
                    answerType: AnswerType.NUMERICAL_SCALE,
                }),
            );

            const result = await controller.create({} as any);
            expect(reviews.createQuestion).toHaveBeenCalledWith({});
            expect(result.id).toBe(1);
            expect(result.title).toBe('Q');
        });
    });

    describe('search', () => {
        it('maps every question to a response', async () => {
            reviews.listQuestions.mockResolvedValue([
                QuestionDomain.create({
                    id: 1,
                    title: 'Q',
                    answerType: AnswerType.NUMERICAL_SCALE,
                }),
            ]);

            const result = await controller.search({} as any);
            expect(reviews.listQuestions).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('delete', () => {
        it('parses the id and forwards the call', async () => {
            await controller.delete('7');
            expect(reviews.deleteQuestion).toHaveBeenCalledWith(7);
        });
    });
});
