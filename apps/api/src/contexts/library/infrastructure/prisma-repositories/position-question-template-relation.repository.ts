import { Prisma } from '@intra/database';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PositionQuestionTemplateRelationRepositoryPort } from '../../application/ports/position-question-template-relation.repository.port';
import { PositionQuestionTemplateRelationDomain } from '../../domain/position-question-template-relation.domain';
import { PositionQuestionTemplateRelationMapper } from '../mappers/position-question-template-relation.mapper';

@Injectable()
export class PositionQuestionTemplateRelationRepository implements PositionQuestionTemplateRelationRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async link(
        questionId: number,
        positionId: number,
    ): Promise<PositionQuestionTemplateRelationDomain> {
        try {
            const relation =
                await this.prisma.positionQuestionTemplateRelation.create({
                    data: { questionTemplateId: questionId, positionId },
                });
            return PositionQuestionTemplateRelationMapper.toDomain(relation);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                const existing =
                    await this.prisma.positionQuestionTemplateRelation.findUnique(
                        {
                            where: {
                                questionTemplateId_positionId: {
                                    questionTemplateId: questionId,
                                    positionId,
                                },
                            },
                        },
                    );
                if (existing)
                    return PositionQuestionTemplateRelationMapper.toDomain(
                        existing,
                    );
            }
            throw error;
        }
    }

    async unlink(questionId: number, positionId: number): Promise<void> {
        await this.prisma.positionQuestionTemplateRelation.deleteMany({
            where: { questionTemplateId: questionId, positionId },
        });
    }

    async listByQuestion(
        questionId: number,
    ): Promise<PositionQuestionTemplateRelationDomain[]> {
        const relations =
            await this.prisma.positionQuestionTemplateRelation.findMany({
                where: { questionTemplateId: questionId },
                orderBy: { createdAt: 'desc' },
            });

        return relations.map(PositionQuestionTemplateRelationMapper.toDomain);
    }

    async replace(
        questionId: number,
        positionIds: number[],
    ): Promise<PositionQuestionTemplateRelationDomain[]> {
        const unique = Array.from(new Set(positionIds));

        await this.prisma.$transaction(async (tx) => {
            const deleteFilter =
                unique.length > 0
                    ? {
                          questionTemplateId: questionId,
                          NOT: { positionId: { in: unique } },
                      }
                    : { questionTemplateId: questionId };
            await tx.positionQuestionTemplateRelation.deleteMany({
                where: deleteFilter,
            });

            if (unique.length) {
                await tx.positionQuestionTemplateRelation.createMany({
                    data: unique.map((positionId) => ({
                        questionTemplateId: questionId,
                        positionId,
                    })),
                    skipDuplicates: true,
                });
            }
        });

        return this.listByQuestion(questionId);
    }
}
