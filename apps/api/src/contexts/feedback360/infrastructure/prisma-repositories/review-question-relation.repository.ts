import { Prisma } from '@intra/database';
import {
    ReviewQuestionRelationSearchQuery,
    ReviewQuestionRelationSortField,
    SortDirection,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REVIEW_QUESTION_RELATION_REPOSITORY,
    ReviewQuestionRelationRepositoryPort,
} from '../../application/ports/review-question-relation.repository.port';
import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';
import { QuestionMapper } from '../mappers/question.mapper';
import { ReviewQuestionRelationMapper } from '../mappers/review-question-relation.mapper';

@Injectable()
export class ReviewQuestionRelationRepository implements ReviewQuestionRelationRepositoryPort {
    readonly [REVIEW_QUESTION_RELATION_REPOSITORY] =
        REVIEW_QUESTION_RELATION_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async link(
        relation: ReviewQuestionRelationDomain,
    ): Promise<ReviewQuestionRelationDomain> {
        const prismaRelation = ReviewQuestionRelationMapper.toPrisma(relation);
        const created = await this.prisma.reviewQuestionRelation.upsert({
            where: {
                reviewId_questionId: {
                    reviewId: relation.reviewId,
                    questionId: relation.questionId,
                },
            },
            create: prismaRelation,
            update: {
                questionTitle: prismaRelation.questionTitle,
                answerType: prismaRelation.answerType,
                competenceId: prismaRelation.competenceId,
                competenceTitle: prismaRelation.competenceTitle,
                isForSelfassessment: prismaRelation.isForSelfassessment,
            },
        });

        return ReviewQuestionRelationMapper.toDomain(created);
    }

    async listByReview(
        reviewId: number,
        query: ReviewQuestionRelationSearchQuery,
    ): Promise<ReviewQuestionRelationDomain[]> {
        const where = this.buildWhere(query);
        where.reviewId = reviewId;
        const orderBy = this.buildOrder(query);
        const relations = await this.prisma.reviewQuestionRelation.findMany({
            where,
            orderBy,
        });
        return relations.map(ReviewQuestionRelationMapper.toDomain);
    }

    async unlink(reviewId: number, questionId: number): Promise<void> {
        await this.prisma.reviewQuestionRelation.delete({
            where: {
                reviewId_questionId: {
                    reviewId,
                    questionId,
                },
            },
        });
    }

    private buildWhere(
        query: ReviewQuestionRelationSearchQuery,
    ): Prisma.ReviewQuestionRelationWhereInput {
        const {
            reviewId,
            questionId,
            questionTitle,
            answerType,
            competenceId,
            competenceTitle,
            isForSelfassessment,
        } = query;
        return {
            ...(reviewId ? { reviewId } : {}),
            ...(questionId ? { questionId } : {}),
            ...(questionTitle
                ? {
                      questionTitle: {
                          contains: questionTitle,
                          mode: 'insensitive',
                      },
                  }
                : {}),
            ...(answerType
                ? {
                      answerType: QuestionMapper.toPrismaAnswerType(answerType),
                  }
                : {}),
            ...(competenceId ? { competenceId } : {}),
            ...(competenceTitle
                ? {
                      competenceTitle: {
                          contains: competenceTitle,
                          mode: 'insensitive',
                      },
                  }
                : {}),
            ...(isForSelfassessment !== undefined
                ? { isForSelfassessment }
                : {}),
        };
    }

    private buildOrder(
        query: ReviewQuestionRelationSearchQuery,
    ): Prisma.ReviewQuestionRelationOrderByWithRelationInput[] {
        const field = query.sortBy ?? ReviewQuestionRelationSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
