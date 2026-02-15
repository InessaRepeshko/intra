import { Prisma } from '@intra/database';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PositionHierarchyRepositoryPort } from '../../application/ports/position-hierarchy.repository.port';
import type { PositionHierarchyDomain } from '../../domain/position-hierarchy.domain';
import { PositionHierarchyMapper } from '../mappers/position-hierarchy.mapper';

@Injectable()
export class PositionHierarchyRepository implements PositionHierarchyRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async link(
        superiorPositionId: number,
        subordinatePositionId: number,
    ): Promise<PositionHierarchyDomain> {
        try {
            const created = await this.prisma.positionHierarchy.create({
                data: { superiorPositionId, subordinatePositionId },
            });
            return PositionHierarchyMapper.toDomain(created);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                const existing = await this.prisma.positionHierarchy.findUnique(
                    {
                        where: {
                            superiorPositionId_subordinatePositionId: {
                                superiorPositionId,
                                subordinatePositionId,
                            },
                        },
                    },
                );
                if (existing) return PositionHierarchyMapper.toDomain(existing);
            }
            throw error;
        }
    }

    async unlink(
        superiorPositionId: number,
        subordinatePositionId: number,
    ): Promise<void> {
        await this.prisma.positionHierarchy.deleteMany({
            where: { superiorPositionId, subordinatePositionId },
        });
    }

    async listSubordinates(
        superiorPositionId: number,
    ): Promise<PositionHierarchyDomain[]> {
        const relations = await this.prisma.positionHierarchy.findMany({
            where: { superiorPositionId },
            orderBy: { createdAt: 'desc' },
        });
        return relations.map(PositionHierarchyMapper.toDomain);
    }

    async listSuperiors(
        subordinatePositionId: number,
    ): Promise<PositionHierarchyDomain[]> {
        const relations = await this.prisma.positionHierarchy.findMany({
            where: { subordinatePositionId },
            orderBy: { createdAt: 'desc' },
        });
        return relations.map(PositionHierarchyMapper.toDomain);
    }
}
