import { Prisma } from '@intra/database';
import {
    ReviewSearchQuery,
    ReviewSortField,
    SortDirection,
    UpdateReviewPayload,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REVIEW_REPOSITORY,
    ReviewRepositoryPort,
} from '../../application/ports/review.repository.port';
import { ReviewDomain } from '../../domain/review.domain';
import { ReviewMapper } from '../mappers/review.mapper';

@Injectable()
export class ReviewRepository implements ReviewRepositoryPort {
    readonly [REVIEW_REPOSITORY] = REVIEW_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async create(review: ReviewDomain): Promise<ReviewDomain> {
        const created = await this.prisma.review.create({
            data: ReviewMapper.toPrisma(review),
        });

        return ReviewMapper.toDomain(created);
    }

    async findById(id: number): Promise<ReviewDomain | null> {
        const review = await this.prisma.review.findUnique({ where: { id } });
        return review ? ReviewMapper.toDomain(review) : null;
    }

    async search(query: ReviewSearchQuery): Promise<ReviewDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);
        const items = await this.prisma.review.findMany({ where, orderBy });
        return items.map(ReviewMapper.toDomain);
    }

    async listByCycleId(cycleId: number): Promise<ReviewDomain[]> {
        const reviews = await this.prisma.review.findMany({
            where: { cycleId },
        });
        return reviews.map(ReviewMapper.toDomain);
    }

    async updateById(
        id: number,
        patch: UpdateReviewPayload,
    ): Promise<ReviewDomain> {
        const updated = await this.prisma.review.update({
            where: { id },
            data: {
                ...patch,
                ...(patch.stage
                    ? {
                          stage: ReviewMapper.toPrismaStage(patch.stage),
                      }
                    : {}),
            },
        });
        return ReviewMapper.toDomain(updated);
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.review.delete({ where: { id } });
    }

    private buildWhere(query: ReviewSearchQuery): Prisma.ReviewWhereInput {
        const {
            cycleId,
            rateeId,
            rateeFullName,
            hrId,
            hrFullName,
            rateePositionId,
            teamId,
            managerId,
            managerFullName,
            managerPositionId,
            managerPositionTitle,
            stage,
            rateePositionTitle,
            hrNote,
            teamTitle,
            reportId,
        } = query;
        return {
            ...(rateeId ? { rateeId } : {}),
            ...(rateeFullName
                ? {
                      rateeFullName: {
                          contains: rateeFullName,
                          mode: 'insensitive',
                      },
                  }
                : {}),
            ...(rateePositionId ? { rateePositionId } : {}),
            ...(rateePositionTitle
                ? {
                      rateePositionTitle: {
                          contains: rateePositionTitle,
                          mode: 'insensitive',
                      },
                  }
                : {}),
            ...(hrId ? { hrId } : {}),
            ...(hrFullName
                ? { hrFullName: { contains: hrFullName, mode: 'insensitive' } }
                : {}),
            ...(hrNote
                ? { hrNote: { contains: hrNote, mode: 'insensitive' } }
                : {}),
            ...(teamId ? { teamId } : {}),
            ...(teamTitle
                ? { teamTitle: { contains: teamTitle, mode: 'insensitive' } }
                : {}),
            ...(managerId ? { managerId } : {}),
            ...(managerFullName
                ? {
                      managerFullName: {
                          contains: managerFullName,
                          mode: 'insensitive',
                      },
                  }
                : {}),
            ...(managerPositionId ? { managerPositionId } : {}),
            ...(managerPositionTitle
                ? {
                      managerPositionTitle: {
                          contains: managerPositionTitle,
                          mode: 'insensitive',
                      },
                  }
                : {}),
            ...(cycleId ? { cycleId } : {}),
            ...(stage ? { stage: ReviewMapper.toPrismaStage(stage) } : {}),
            ...(reportId ? { reportId } : {}),
        };
    }

    private buildOrder(
        query: ReviewSearchQuery,
    ): Prisma.ReviewOrderByWithRelationInput[] {
        const field = query.sortBy ?? ReviewSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
