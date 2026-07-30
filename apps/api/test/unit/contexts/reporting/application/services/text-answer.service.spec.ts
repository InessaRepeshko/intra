import {
    AnswerType,
    IdentityRole,
    RespondentCategory,
} from '@intra/shared-kernel';
import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ANSWER_REPOSITORY } from 'src/contexts/feedback360/application/ports/answer.repository.port';
import { REVIEW_QUESTION_RELATION_REPOSITORY } from 'src/contexts/feedback360/application/ports/review-question-relation.repository.port';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';
import { ReviewQuestionRelationDomain } from 'src/contexts/feedback360/domain/review-question-relation.domain';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { TextAnswerService } from 'src/contexts/reporting/application/services/text-answer.service';

describe('TextAnswerService', () => {
    let service: TextAnswerService;
    let answers: any;
    let relations: any;

    beforeEach(async () => {
        answers = { list: jest.fn() };
        relations = { listByReview: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                TextAnswerService,
                { provide: ANSWER_REPOSITORY, useValue: answers },
                {
                    provide: REVIEW_QUESTION_RELATION_REPOSITORY,
                    useValue: relations,
                },
            ],
        }).compile();

        service = module.get(TextAnswerService);
    });

    describe('listByReview', () => {
        it('returns text answers paired with their question titles for admin/HR actors', async () => {
            const actor = UserDomain.create({
                id: 1,
                firstName: 'A',
                lastName: 'B',
                email: 'a@b.com',
                roles: [IdentityRole.HR],
            });

            answers.list.mockResolvedValue([
                AnswerDomain.create({
                    reviewId: 10,
                    questionId: 100,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.TEXT_FIELD,
                    textValue: 'Great work',
                }),
            ]);
            relations.listByReview.mockResolvedValue([
                ReviewQuestionRelationDomain.create({
                    reviewId: 10,
                    questionId: 100,
                    questionTitle: 'Q?',
                    answerType: AnswerType.TEXT_FIELD,
                    competenceId: 7,
                    competenceTitle: 'Teamwork',
                }),
            ]);

            const result = await service.listByReview(10, actor);

            expect(answers.list).toHaveBeenCalledWith({
                reviewId: 10,
                answerType: AnswerType.TEXT_FIELD,
            });
            expect(result).toEqual([
                {
                    questionId: 100,
                    questionTitle: 'Q?',
                    respondentCategory: RespondentCategory.TEAM,
                    textValue: 'Great work',
                },
            ]);
        });

        it('skips answers with empty or whitespace-only text', async () => {
            const actor = UserDomain.create({
                id: 1,
                firstName: 'A',
                lastName: 'B',
                email: 'a@b.com',
                roles: [IdentityRole.ADMIN],
            });

            answers.list.mockResolvedValue([
                AnswerDomain.create({
                    reviewId: 10,
                    questionId: 100,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.TEXT_FIELD,
                    textValue: '   ',
                }),
                AnswerDomain.create({
                    reviewId: 10,
                    questionId: 101,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.TEXT_FIELD,
                    textValue: '',
                }),
                AnswerDomain.create({
                    reviewId: 10,
                    questionId: 102,
                    respondentCategory: RespondentCategory.TEAM,
                    answerType: AnswerType.TEXT_FIELD,
                    textValue: 'real',
                }),
            ]);
            relations.listByReview.mockResolvedValue([]);

            const result = await service.listByReview(10, actor);

            expect(result).toHaveLength(1);
            expect(result[0].textValue).toBe('real');
            expect(result[0].questionTitle).toBeNull();
        });

        it('throws ForbiddenException for non-admin/HR actors', async () => {
            const actor = UserDomain.create({
                id: 1,
                firstName: 'A',
                lastName: 'B',
                email: 'a@b.com',
                roles: [IdentityRole.EMPLOYEE],
            });

            await expect(
                service.listByReview(10, actor),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });

        it('skips the access check when no actor is supplied', async () => {
            answers.list.mockResolvedValue([]);
            relations.listByReview.mockResolvedValue([]);

            const result = await service.listByReview(10);

            expect(result).toEqual([]);
            expect(answers.list).toHaveBeenCalled();
        });
    });
});
