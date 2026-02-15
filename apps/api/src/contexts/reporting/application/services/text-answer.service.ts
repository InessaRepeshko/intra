import {
    AnswerType,
    IdentityRole,
    ReportTextAnswerDto,
} from '@intra/shared-kernel';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import {
    ANSWER_REPOSITORY,
    AnswerRepositoryPort,
} from '../../../feedback360/application/ports/answer.repository.port';
import {
    REVIEW_QUESTION_RELATION_REPOSITORY,
    ReviewQuestionRelationRepositoryPort,
} from '../../../feedback360/application/ports/review-question-relation.repository.port';
import { ReviewQuestionRelationDomain } from '../../../feedback360/domain/review-question-relation.domain';

@Injectable()
export class TextAnswerService {
    constructor(
        @Inject(ANSWER_REPOSITORY)
        private readonly answers: AnswerRepositoryPort,
        @Inject(REVIEW_QUESTION_RELATION_REPOSITORY)
        private readonly relations: ReviewQuestionRelationRepositoryPort,
    ) {}

    async listByReview(
        reviewId: number,
        actor?: UserDomain,
    ): Promise<ReportTextAnswerDto[]> {
        await this.checkAccessToTextAnswers(actor);

        const [answers, relations] = await Promise.all([
            this.answers.list({
                reviewId,
                answerType: AnswerType.TEXT_FIELD,
            }),
            this.relations.listByReview(reviewId, {}),
        ]);

        const relationMap = new Map<number, ReviewQuestionRelationDomain>();
        relations.forEach((relation) => {
            relationMap.set(relation.questionId, relation);
        });

        return answers
            .filter(
                (answer) => answer.textValue && answer.textValue.trim() !== '',
            )
            .map((answer) => {
                const relation = relationMap.get(answer.questionId);
                return {
                    questionId: answer.questionId,
                    questionTitle: relation?.questionTitle ?? null,
                    respondentCategory: answer.respondentCategory,
                    textValue: answer.textValue!,
                };
            });
    }

    /**
     * Checks if the actor has access to the text answers
     * as an admin or hr.
     * @param actor The actor to check access for.
     */
    private async checkAccessToTextAnswers(actor?: UserDomain): Promise<void> {
        if (!actor) return;

        const isAdminOrHr =
            actor?.roles?.includes(IdentityRole.ADMIN) ||
            actor?.roles?.includes(IdentityRole.HR);

        if (isAdminOrHr) return;

        throw new ForbiddenException(
            'You do not have permission to view text answers for this review',
        );
    }
}
