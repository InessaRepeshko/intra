import { Prisma } from '@intra/database';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CompetenceQuestionTemplateRelationRepositoryPort } from '../../application/ports/competence-question-template-relation.repository.port';
import { CompetenceQuestionTemplateRelationDomain } from '../../domain/competence-question-template-relation.domain';
import { LibraryMapper } from './library.mapper';

@Injectable()
export class CompetenceQuestionTemplateRelationRepository implements CompetenceQuestionTemplateRelationRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async link(
        competenceId: number,
        questionTemplateId: number,
    ): Promise<CompetenceQuestionTemplateRelationDomain> {
        try {
            const relation =
                await this.prisma.competenceQuestionTemplateRelation.create({
                    data: { competenceId, questionTemplateId },
                });
            return LibraryMapper.toCompetenceQuestionTemplateRelationDomain(
                relation,
            );
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                const existing =
                    await this.prisma.competenceQuestionTemplateRelation.findUnique(
                        {
                            where: {
                                competenceId_questionTemplateId: {
                                    competenceId,
                                    questionTemplateId,
                                },
                            },
                        },
                    );
                if (existing)
                    return LibraryMapper.toCompetenceQuestionTemplateRelationDomain(
                        existing,
                    );
            }
            throw error;
        }
    }

    async unlink(
        competenceId: number,
        questionTemplateId: number,
    ): Promise<void> {
        await this.prisma.competenceQuestionTemplateRelation.deleteMany({
            where: { competenceId, questionTemplateId },
        });
    }

    async listByCompetence(
        competenceId: number,
    ): Promise<CompetenceQuestionTemplateRelationDomain[]> {
        const relations =
            await this.prisma.competenceQuestionTemplateRelation.findMany({
                where: { competenceId },
                orderBy: { createdAt: 'desc' },
            });
        return relations.map(
            LibraryMapper.toCompetenceQuestionTemplateRelationDomain,
        );
    }

    async listByQuestionTemplate(
        questionTemplateId: number,
    ): Promise<CompetenceQuestionTemplateRelationDomain[]> {
        const relations =
            await this.prisma.competenceQuestionTemplateRelation.findMany({
                where: { questionTemplateId },
                orderBy: { createdAt: 'desc' },
            });
        return relations.map(
            LibraryMapper.toCompetenceQuestionTemplateRelationDomain,
        );
    }

    async replaceForCompetence(
        competenceId: number,
        questionTemplateIds: number[],
    ): Promise<CompetenceQuestionTemplateRelationDomain[]> {
        const unique = Array.from(new Set(questionTemplateIds));

        await this.prisma.$transaction(async (tx) => {
            const deleteFilter =
                unique.length > 0
                    ? {
                          competenceId,
                          NOT: { questionTemplateId: { in: unique } },
                      }
                    : { competenceId };
            await tx.competenceQuestionTemplateRelation.deleteMany({
                where: deleteFilter,
            });

            if (unique.length) {
                await tx.competenceQuestionTemplateRelation.createMany({
                    data: unique.map((questionTemplateId) => ({
                        competenceId,
                        questionTemplateId,
                    })),
                    skipDuplicates: true,
                });
            }
        });

        return this.listByCompetence(competenceId);
    }
}
