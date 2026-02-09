import { Prisma } from '@intra/database';
import {
    QuestionTemplateSearchQuery,
    QuestionTemplateSortField,
    SortDirection,
    UpdateQuestionTemplatePayload,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { QuestionTemplateRepositoryPort } from '../../application/ports/question-template.repository.port';
import { QuestionTemplateDomain } from '../../domain/question-template.domain';
import { QuestionTemplateMapper } from '../mappers/question-template.mapper';

@Injectable()
export class QuestionTemplateRepository implements QuestionTemplateRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        question: QuestionTemplateDomain,
    ): Promise<QuestionTemplateDomain> {
        const created = await this.prisma.questionTemplate.create({
            data: {
                title: question.title,
                answerType: question.answerType,
                competenceId: question.competenceId,
                isForSelfassessment: question.isForSelfassessment,
                status: question.status,
                positionRelations: {
                    create: question.positionIds.map((positionId) => ({
                        positionId,
                    })),
                },
            },
            include: { positionRelations: { select: { positionId: true } } },
        });

        return QuestionTemplateMapper.toDomain(created);
    }

    async findById(id: number): Promise<QuestionTemplateDomain | null> {
        const question = await this.prisma.questionTemplate.findUnique({
            where: { id },
            include: { positionRelations: { select: { positionId: true } } },
        });

        return question ? QuestionTemplateMapper.toDomain(question) : null;
    }

    async search(
        query: QuestionTemplateSearchQuery,
    ): Promise<QuestionTemplateDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);

        const items = await this.prisma.questionTemplate.findMany({
            where,
            orderBy,
            include: { positionRelations: { select: { positionId: true } } },
        });

        return items.map(QuestionTemplateMapper.toDomain);
    }

    async updateById(
        id: number,
        patch: UpdateQuestionTemplatePayload,
    ): Promise<QuestionTemplateDomain> {
        const updated = await this.prisma.questionTemplate.update({
            where: { id },
            data: {
                ...patch,
            },
            include: { positionRelations: { select: { positionId: true } } },
        });

        return QuestionTemplateMapper.toDomain(updated);
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.questionTemplate.delete({ where: { id } });
    }

    private buildWhere(
        query: QuestionTemplateSearchQuery,
    ): Prisma.QuestionTemplateWhereInput {
        const {
            competenceId,
            positionIds,
            status: status,
            answerType,
            isForSelfassessment,
            title,
        } = query;

        return {
            ...(title
                ? { title: { contains: title, mode: 'insensitive' } }
                : {}),
            ...(competenceId ? { competenceId } : {}),
            ...(status ? { status } : {}),
            ...(answerType ? { answerType } : {}),
            ...(isForSelfassessment !== undefined
                ? { isForSelfassessment }
                : {}),
            ...(positionIds
                ? {
                      positionRelations: {
                          some: { positionId: { in: positionIds } },
                      },
                  }
                : {}),
        };
    }

    private buildOrder(
        query: QuestionTemplateSearchQuery,
    ): Prisma.QuestionTemplateOrderByWithRelationInput[] {
        const field = query.sortBy ?? QuestionTemplateSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
