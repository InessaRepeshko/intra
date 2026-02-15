import { Prisma } from '@intra/database';
import {
    AnswerSearchQuery,
    AnswerSortField,
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
