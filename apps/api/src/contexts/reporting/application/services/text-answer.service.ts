import { AnswerType, ReportTextAnswerDto } from '@intra/shared-kernel';
import { Inject, Injectable } from '@nestjs/common';
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

    async listByReview(reviewId: number): Promise<ReportTextAnswerDto[]> {
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
}
