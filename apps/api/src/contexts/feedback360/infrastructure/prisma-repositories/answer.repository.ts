import { Prisma } from '@intra/database';
import {
    AnswerSearchQuery,
    AnswerSortField,
    RespondentCategory,
    SortDirection,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    ANSWER_REPOSITORY,
    AnswerRepositoryPort,
} from '../../application/ports/answer.repository.port';
import { AnswerDomain } from '../../domain/answer.domain';
import { AnswerMapper } from '../mappers/answer.mapper';
import { QuestionMapper } from '../mappers/question.mapper';
import { RespondentMapper } from '../mappers/respondent.mapper';

@Injectable()
export class AnswerRepository implements AnswerRepositoryPort {
    readonly [ANSWER_REPOSITORY] = ANSWER_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async create(answer: AnswerDomain): Promise<AnswerDomain> {
        const created = await this.prisma.answer.create({
            data: AnswerMapper.toPrisma(answer),
        });

        return AnswerMapper.toDomain(created);
    }

    async list(query: AnswerSearchQuery): Promise<AnswerDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);
        const answers = await this.prisma.answer.findMany({ where, orderBy });
        return answers.map(AnswerMapper.toDomain);
    }

    async findById(id: number): Promise<AnswerDomain | null> {
        const answer = await this.prisma.answer.findUnique({ where: { id } });
        return answer ? AnswerMapper.toDomain(answer) : null;
    }

    async getAnswersCountByRespondentCategories(
        reviewId: number,
    ): Promise<{ respondentCategory: RespondentCategory; answers: number }[]> {
        // 1. Calculate the number of unique questions in the review
        const questions = await this.prisma.answer.findMany({
            where: { reviewId },
            distinct: ['questionId'],
            select: { questionId: true },
        });

        const questionsCount = questions.length;

        if (questionsCount === 0) return [];

        // 2. Calculate total number of answers by respondent category
        const stats = await this.prisma.answer.groupBy({
            by: ['respondentCategory'],
            where: { reviewId: reviewId },
            _count: { _all: true },
        });

        // 3. Map the result: divide the total count by the number of questions
        return stats.map((stat) => {
            const totalRows = stat._count._all;
            return {
                respondentCategory: AnswerMapper.fromPrismaCategory(
                    stat.respondentCategory,
                ),
                // Math.ceil on the off chance someone skipped a question
                answers: Math.ceil(totalRows / questionsCount),
            };
        });
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.answer.delete({ where: { id } });
    }

    private buildWhere(query: AnswerSearchQuery): Prisma.AnswerWhereInput {
        const {
            reviewId,
            questionId,
            respondentCategory,
            answerType,
            numericalValue,
            textValue,
        } = query;
        return {
            ...(reviewId ? { reviewId } : {}),
            ...(questionId ? { questionId } : {}),
            ...(respondentCategory
                ? {
                      respondentCategory:
                          RespondentMapper.toPrismaCategory(respondentCategory),
                  }
                : {}),
            ...(answerType
                ? {
                      answerType: QuestionMapper.toPrismaAnswerType(answerType),
                  }
                : {}),
            ...(numericalValue ? { numericalValue } : {}),
            ...(textValue
                ? { textValue: { contains: textValue, mode: 'insensitive' } }
                : {}),
        };
    }

    private buildOrder(
        query: AnswerSearchQuery,
    ): Prisma.AnswerOrderByWithRelationInput[] {
        const field = query.sortBy ?? AnswerSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
