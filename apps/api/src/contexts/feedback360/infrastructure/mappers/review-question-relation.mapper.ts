import {
    Prisma,
    ReviewQuestionRelation as PrismaReviewQuestionRelation,
} from '@intra/database';
import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';
import { QuestionMapper } from './question.mapper';

export class ReviewQuestionRelationMapper {
    static toDomain(
        relation: PrismaReviewQuestionRelation,
    ): ReviewQuestionRelationDomain {
        return ReviewQuestionRelationDomain.create({
            id: relation.id,
            reviewId: relation.reviewId,
            questionId: relation.questionId,
            questionTitle: relation.questionTitle,
            answerType: QuestionMapper.fromPrismaAnswerType(
                relation.answerType,
            ),
            competenceId: relation.competenceId,
            competenceTitle: relation.competenceTitle,
            isForSelfassessment: relation.isForSelfassessment ?? false,
            createdAt: relation.createdAt,
        });
    }

    static toPrisma(
        relation: ReviewQuestionRelationDomain,
    ): Prisma.ReviewQuestionRelationUncheckedCreateInput {
        return {
            reviewId: relation.reviewId,
            questionId: relation.questionId,
            questionTitle: relation.questionTitle,
            answerType: QuestionMapper.toPrismaAnswerType(relation.answerType),
            competenceId: relation.competenceId,
            competenceTitle: relation.competenceTitle,
            isForSelfassessment: relation.isForSelfassessment,
        };
    }
}
