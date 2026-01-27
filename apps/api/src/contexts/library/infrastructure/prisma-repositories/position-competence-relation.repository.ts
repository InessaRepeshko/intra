import { Prisma } from '@intra/database';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PositionCompetenceRelationRepositoryPort } from '../../application/ports/position-competence-relation.repository.port';
import { PositionCompetenceRelationDomain } from '../../domain/position-competence-relation.domain';
import { LibraryMapper } from './library.mapper';

@Injectable()
export class PositionCompetenceRelationRepository implements PositionCompetenceRelationRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async link(
        competenceId: number,
        positionId: number,
    ): Promise<PositionCompetenceRelationDomain> {
        try {
            const relation =
                await this.prisma.positionCompetenceRelation.create({
                    data: { competenceId, positionId },
                });
            return LibraryMapper.toPositionCompetenceRelationDomain(relation);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                const existing =
                    await this.prisma.positionCompetenceRelation.findUnique({
                        where: {
                            positionId_competenceId: {
                                positionId,
                                competenceId,
                            },
                        },
                    });
                if (existing)
                    return LibraryMapper.toPositionCompetenceRelationDomain(
                        existing,
                    );
            }
            throw error;
        }
    }

    async unlink(competenceId: number, positionId: number): Promise<void> {
        await this.prisma.positionCompetenceRelation.deleteMany({
            where: { competenceId, positionId },
        });
    }

    async listByCompetence(
        competenceId: number,
    ): Promise<PositionCompetenceRelationDomain[]> {
        const relations = await this.prisma.positionCompetenceRelation.findMany(
            {
                where: { competenceId },
                orderBy: { createdAt: 'desc' },
            },
        );
        return relations.map(LibraryMapper.toPositionCompetenceRelationDomain);
    }

    async listByPosition(
        positionId: number,
    ): Promise<PositionCompetenceRelationDomain[]> {
        const relations = await this.prisma.positionCompetenceRelation.findMany(
            {
                where: { positionId },
                orderBy: { createdAt: 'desc' },
            },
        );
        return relations.map(LibraryMapper.toPositionCompetenceRelationDomain);
    }

    async replaceForCompetence(
        competenceId: number,
        positionIds: number[],
    ): Promise<PositionCompetenceRelationDomain[]> {
        const unique = Array.from(new Set(positionIds));

        await this.prisma.$transaction(async (tx) => {
            const deleteFilter =
                unique.length > 0
                    ? { competenceId, NOT: { positionId: { in: unique } } }
                    : { competenceId };
            await tx.positionCompetenceRelation.deleteMany({
                where: deleteFilter,
            });

            if (unique.length) {
                await tx.positionCompetenceRelation.createMany({
                    data: unique.map((positionId) => ({
                        competenceId,
                        positionId,
                    })),
                    skipDuplicates: true,
                });
            }
        });

        return this.listByCompetence(competenceId);
    }
}
