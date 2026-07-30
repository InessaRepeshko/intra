import '../../../setup-env';

import { CycleStage, ReviewStage } from '@intra/shared-kernel';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TestingModule } from '@nestjs/testing';
import { CycleStageChangedEvent } from 'src/contexts/feedback360/application/events/cycle-stage-changed.event';
import { CycleStageListener } from 'src/contexts/feedback360/application/listeners/cycle-stage.listener';
import { ClusterScoreAnalyticsService } from 'src/contexts/feedback360/application/services/cluster-score-analytics.service';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
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

describe('CycleStageListener (feedback360, integration)', () => {
    let module: TestingModule;
    let listener: CycleStageListener;
    let analytics: ClusterScoreAnalyticsService;
    let cycleRepo: CycleRepository;
    let reviewRepo: ReviewRepository;
    let competenceRepo: CompetenceRepository;
    let clusterRepo: ClusterRepository;
    let positionRepo: PositionRepository;
    let identityUsers: IdentityUserService;
    let eventEmitter: EventEmitter2;
    let prisma: PrismaService;

    let cycleId: number;
    let clusterId: number;
    let rateeId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        listener = module.get(CycleStageListener);
        analytics = module.get(ClusterScoreAnalyticsService);
        cycleRepo = module.get(CycleRepository);
        reviewRepo = module.get(ReviewRepository);
        competenceRepo = module.get(CompetenceRepository);
        clusterRepo = module.get(ClusterRepository);
        positionRepo = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        eventEmitter = module.get(EventEmitter2);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetFeedback360Tables(prisma);
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const ratee = await identityUsers.create({
            firstName: 'Robert',
            lastName: 'Smith',
            email: `ratee.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const position = await positionRepo.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        const competence = await competenceRepo.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        const cluster = await clusterRepo.create(
            ClusterDomain.create({
                competenceId: competence.id!,
                lowerBound: 0,
                upperBound: 5,
                title: 'Beginner',
                description: '',
            }),
        );
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );

        cycleId = cycle.id!;
        clusterId = cluster.id!;
        rateeId = ratee.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    async function seedClusterScore(reviewId: number) {
        await prisma.clusterScore.create({
            data: {
                cycleId,
                clusterId,
                rateeId,
                reviewId,
                score: '3.5000',
                answersCount: 4,
            },
        });
    }

    async function seedReview(): Promise<number> {
        const hr = await identityUsers.create({
            firstName: 'HR',
            lastName: 'P',
            email: `hr2.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const position = (await positionRepo.search({} as any))[0];
        const review = await reviewRepo.create(
            ReviewDomain.create({
                rateeId,
                rateeFullName: 'Robert Smith',
                rateePositionId: position.id!,
                rateePositionTitle: 'Engineer',
                hrId: hr.id!,
                hrFullName: 'HR P',
                cycleId,
                stage: ReviewStage.FINISHED,
            }),
        );
        return review.id!;
    }

    describe('handleCycleStageChanged', () => {
        it('emits cycle.stage.processed and does nothing else when toStage is not FINISHED', async () => {
            const processedEvents: any[] = [];
            eventEmitter.on('cycle.stage.processed', (e) =>
                processedEvents.push(e),
            );

            await listener.handleCycleStageChanged(
                new CycleStageChangedEvent(
                    cycleId,
                    CycleStage.NEW,
                    CycleStage.ACTIVE,
                ),
            );

            expect(processedEvents).toHaveLength(1);
            expect(processedEvents[0].cycleId).toBe(cycleId);
            expect(processedEvents[0].currentStage).toBe(CycleStage.ACTIVE);

            const analyticsRows = await analytics.getByCycleId(cycleId);
            expect(analyticsRows).toEqual([]);
        });

        it('emits cycle.stage.processed but skips analytics when the cycle has no reviews', async () => {
            const processedEvents: any[] = [];
            eventEmitter.on('cycle.stage.processed', (e) =>
                processedEvents.push(e),
            );

            await listener.handleCycleStageChanged(
                new CycleStageChangedEvent(
                    cycleId,
                    CycleStage.ACTIVE,
                    CycleStage.FINISHED,
                ),
            );

            expect(processedEvents).toHaveLength(1);
            const analyticsRows = await analytics.getByCycleId(cycleId);
            expect(analyticsRows).toEqual([]);
        });

        it('generates analytics when the cycle has reviews + cluster scores and emits processed', async () => {
            const reviewId = await seedReview();
            await seedClusterScore(reviewId);
            const processedEvents: any[] = [];
            eventEmitter.on('cycle.stage.processed', (e) =>
                processedEvents.push(e),
            );

            await listener.handleCycleStageChanged(
                new CycleStageChangedEvent(
                    cycleId,
                    CycleStage.ACTIVE,
                    CycleStage.FINISHED,
                ),
            );

            expect(processedEvents).toHaveLength(1);
            const analyticsRows = await analytics.getByCycleId(cycleId);
            expect(analyticsRows).toHaveLength(1);
            expect(analyticsRows[0].clusterId).toBe(clusterId);
        });
    });
});
