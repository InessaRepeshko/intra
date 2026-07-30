import '../../../setup-env';

import {
    AnswerType,
    CycleStage,
    EntityType,
    RespondentCategory,
    ReviewStage,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleStageProcessedEvent } from 'src/contexts/feedback360/application/events/cycle-stage-processed.event';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { AnswerRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/answer.repository';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/question.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { CycleStageListener } from 'src/contexts/reporting/application/listeners/cycle-stage.listener';
import { ReportAnalyticsDomain } from 'src/contexts/reporting/domain/report-analytics.domain';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { ReportAnalyticsRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report-analytics.repository';
import { ReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report.repository';
import { StrategicReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/strategic-report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('CycleStageListener (reporting, integration)', () => {
    // The production listener schedules a setTimeout(..., 10000) that
    // queries Prisma after the test (and the pool) has shut down. Fake
    // timers prevent that timeout from running so Jest can exit cleanly.
    // We exempt setImmediate/setInterval/nextTick so Prisma's own
    // internals keep working.
    beforeAll(() => {
        jest.useFakeTimers({
            doNotFake: ['nextTick', 'setImmediate', 'setInterval'],
        });
    });
    afterAll(() => {
        jest.useRealTimers();
    });

    let module: TestingModule;
    let listener: CycleStageListener;
    let cycleRepo: CycleRepository;
    let reviewRepo: ReviewRepository;
    let questionRepo: QuestionRepository;
    let answerRepo: AnswerRepository;
    let reportRepo: ReportRepository;
    let reportAnalyticsRepo: ReportAnalyticsRepository;
    let strategicRepo: StrategicReportRepository;
    let competenceRepo: CompetenceRepository;
    let positionRepo: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let hrId: number;
    let rateeId: number;
    let positionId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        listener = module.get(CycleStageListener);
        cycleRepo = module.get(CycleRepository);
        reviewRepo = module.get(ReviewRepository);
        questionRepo = module.get(QuestionRepository);
        answerRepo = module.get(AnswerRepository);
        reportRepo = module.get(ReportRepository);
        reportAnalyticsRepo = module.get(ReportAnalyticsRepository);
        strategicRepo = module.get(StrategicReportRepository);
        competenceRepo = module.get(CompetenceRepository);
        positionRepo = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetReportingTables(prisma);
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

        hrId = hr.id!;
        rateeId = ratee.id!;
        positionId = position.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    async function seedFinishedCycleWithReportAndCompetence(): Promise<{
        cycleId: number;
        reviewId: number;
        competenceId: number;
    }> {
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId,
                stage: CycleStage.FINISHED,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        const review = await reviewRepo.create(
            ReviewDomain.create({
                rateeId,
                rateeFullName: 'Robert Smith',
                rateePositionId: positionId,
                rateePositionTitle: 'Engineer',
                hrId,
                hrFullName: 'Helena Reed',
                cycleId: cycle.id!,
                stage: ReviewStage.FINISHED,
            }),
        );
        const competence = await competenceRepo.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        const question = await questionRepo.create(
            QuestionDomain.create({
                cycleId: cycle.id!,
                title: 'Q?',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId: competence.id!,
            }),
        );
        // generateStrategicReportForCycle needs at least one Report
        // tied to the cycle + at least one answer so allCompetences
        // populates (otherwise insight rows reference competenceId=-1
        // and the FK fails).
        const report = await reportRepo.create(
            ReportDomain.create({
                reviewId: review.id!,
                cycleId: cycle.id!,
                respondentCount: 3,
                respondentCategories: [
                    RespondentCategory.TEAM,
                    RespondentCategory.OTHER,
                ],
                answerCount: 12,
                turnoutPctOfTeam: 80,
                turnoutPctOfOther: 50,
                analytics: [],
            }),
        );
        await reportAnalyticsRepo.createMany(report.id!, [
            ReportAnalyticsDomain.create({
                reportId: report.id!,
                entityType: EntityType.COMPETENCE,
                questionId: null,
                questionTitle: null,
                competenceId: competence.id!,
                competenceTitle: 'Teamwork',
                averageBySelfAssessment: 4.5,
                averageByTeam: 3.8,
                averageByOther: 4.0,
            }),
        ]);
        await answerRepo.create(
            AnswerDomain.create({
                reviewId: review.id!,
                questionId: question.id!,
                respondentCategory: RespondentCategory.TEAM,
                answerType: AnswerType.NUMERICAL_SCALE,
                numericalValue: 4,
            }),
        );
        return {
            cycleId: cycle.id!,
            reviewId: review.id!,
            competenceId: competence.id!,
        };
    }

    describe('handleCycleStageProcessed', () => {
        it('does nothing when currentStage is not FINISHED', async () => {
            const cycle = await cycleRepo.create(
                CycleDomain.create({
                    title: 'Cycle',
                    hrId,
                    stage: CycleStage.ACTIVE,
                    startDate: new Date('2026-01-01'),
                    endDate: new Date('2026-03-31'),
                }),
            );

            await listener.handleCycleStageProcessed(
                new CycleStageProcessedEvent(cycle.id!, CycleStage.ACTIVE),
            );

            const cycleAfter = await cycleRepo.findById(cycle.id!);
            expect(cycleAfter!.stage).toBe(CycleStage.ACTIVE);
            const strategic = await strategicRepo.findByCycleId(cycle.id!);
            expect(strategic).toBeNull();
        });

        it('drives the cycle FINISHED → PREPARING_REPORT → PUBLISHED and generates a strategic report', async () => {
            const { cycleId } =
                await seedFinishedCycleWithReportAndCompetence();

            await listener.handleCycleStageProcessed(
                new CycleStageProcessedEvent(cycleId, CycleStage.FINISHED),
            );

            const cycleAfter = await cycleRepo.findById(cycleId);
            expect(cycleAfter!.stage).toBe(CycleStage.PUBLISHED);

            const strategic = await strategicRepo.findByCycleId(cycleId);
            expect(strategic).not.toBeNull();
        });
    });
});
