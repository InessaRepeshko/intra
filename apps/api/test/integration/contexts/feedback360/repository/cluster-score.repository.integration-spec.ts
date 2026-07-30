import '../../../setup-env';

import { ReviewStage } from '@intra/shared-kernel';
import { NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ClusterScoreWithRelationsDomain } from 'src/contexts/feedback360/domain/cluster-score-with-relations.domain';
import { ClusterScoreDomain } from 'src/contexts/feedback360/domain/cluster-score.domain';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { ClusterScoreRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cluster-score.repository';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { ClusterRepository } from 'src/contexts/library/infrastructure/prisma-repositories/cluster.repository';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('ClusterScoreRepository (integration)', () => {
    let module: TestingModule;
    let repo: ClusterScoreRepository;
    let reviews: ReviewRepository;
    let cycles: CycleRepository;
    let positions: PositionRepository;
    let competences: CompetenceRepository;
    let clusters: ClusterRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let cycleId: number;
    let reviewId: number;
    let rateeId: number;
    let clusterId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        repo = module.get(ClusterScoreRepository);
        reviews = module.get(ReviewRepository);
        cycles = module.get(CycleRepository);
        positions = module.get(PositionRepository);
        competences = module.get(CompetenceRepository);
        clusters = module.get(ClusterRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetFeedback360Tables(prisma);
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}@example.com`,
        } as any);
        const ratee = await identityUsers.create({
            firstName: 'Robert',
            lastName: 'Smith',
            email: `ratee.${Date.now()}@example.com`,
        } as any);
        const position = await positions.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        const competence = await competences.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        const cluster = await clusters.create(
            ClusterDomain.create({
                competenceId: competence.id!,
                lowerBound: 0,
                upperBound: 3,
                title: 'Beginner',
                description: '',
            }),
        );
        const cycle = await cycles.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        const review = await reviews.create(
            ReviewDomain.create({
                rateeId: ratee.id!,
                rateeFullName: 'Robert Smith',
                rateePositionId: position.id!,
                rateePositionTitle: 'Engineer',
                hrId: hr.id!,
                hrFullName: 'Helena Reed',
                cycleId: cycle.id!,
                stage: ReviewStage.FINISHED,
            }),
        );

        cycleId = cycle.id!;
        reviewId = review.id!;
        rateeId = ratee.id!;
        clusterId = cluster.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function buildScore(score: number = 3.5): ClusterScoreDomain {
        return ClusterScoreDomain.create({
            cycleId,
            clusterId,
            rateeId,
            reviewId,
            score,
            answersCount: 5,
        });
    }

    describe('upsert', () => {
        it('creates a new score row', async () => {
            const saved = await repo.upsert(buildScore(3.5));

            expect(saved.id).toBeDefined();
            expect(saved.score.toNumber()).toBe(3.5);
            expect(saved.answersCount).toBe(5);
        });

        it('updates the existing row when (clusterId, rateeId) match', async () => {
            const first = await repo.upsert(buildScore(3.5));
            const second = await repo.upsert(buildScore(4.2));

            expect(second.id).toBe(first.id);
            expect(second.score.toNumber()).toBe(4.2);

            const rows = await prisma.clusterScore.findMany({
                where: { clusterId, rateeId },
            });
            expect(rows).toHaveLength(1);
        });
    });

    describe('list', () => {
        it('filters by cycleId', async () => {
            await repo.upsert(buildScore(3.5));

            const result = await repo.list({ cycleId } as any);
            expect(result).toHaveLength(1);
        });

        it('filters by clusterId', async () => {
            await repo.upsert(buildScore(3.5));

            const result = await repo.list({ clusterId } as any);
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('returns the score with cluster and ratee relations', async () => {
            const saved = await repo.upsert(buildScore(3.5));

            const fetched = await repo.getById(saved.id!);

            expect(fetched).toBeInstanceOf(ClusterScoreWithRelationsDomain);
            expect(fetched.cluster.id).toBe(clusterId);
            expect(fetched.ratee.id).toBe(rateeId);
        });

        it('throws NotFoundException for a missing id', async () => {
            await expect(repo.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('getByCycleId', () => {
        it('returns scores tied to the cycle with relations', async () => {
            await repo.upsert(buildScore(3.5));

            const result = await repo.getByCycleId(cycleId);

            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(ClusterScoreWithRelationsDomain);
        });
    });

    describe('deleteById', () => {
        it('removes the row', async () => {
            const saved = await repo.upsert(buildScore(3.5));

            await repo.deleteById(saved.id!);

            const fromDb = await prisma.clusterScore.findUnique({
                where: { id: saved.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
