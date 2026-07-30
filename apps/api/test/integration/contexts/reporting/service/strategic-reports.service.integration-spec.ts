import '../../../setup-env';

import {
    AnswerType,
    EntityType,
    IdentityRole,
    RespondentCategory,
    ReviewStage,
} from '@intra/shared-kernel';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { AnswerDomain } from 'src/contexts/feedback360/domain/answer.domain';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { AnswerRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/answer.repository';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/question.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { StrategicReportingService } from 'src/contexts/reporting/application/services/strategic-reports.service';
import { ReportAnalyticsDomain } from 'src/contexts/reporting/domain/report-analytics.domain';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { StrategicReportDomain } from 'src/contexts/reporting/domain/strategic-report.domain';
import { ReportAnalyticsRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report-analytics.repository';
import { ReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report.repository';
import { StrategicReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/strategic-report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('StrategicReportingService (integration)', () => {
    let module: TestingModule;
    let service: StrategicReportingService;
    let strategicRepo: StrategicReportRepository;
    let reportRepo: ReportRepository;
    let reportAnalyticsRepo: ReportAnalyticsRepository;
    let answerRepo: AnswerRepository;
    let reviewRepo: ReviewRepository;
    let cycleRepo: CycleRepository;
    let questionRepo: QuestionRepository;
    let competenceRepo: CompetenceRepository;
    let positionRepo: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let hrId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        service = module.get(StrategicReportingService);
        strategicRepo = module.get(StrategicReportRepository);
        reportRepo = module.get(ReportRepository);
        reportAnalyticsRepo = module.get(ReportAnalyticsRepository);
        answerRepo = module.get(AnswerRepository);
        reviewRepo = module.get(ReviewRepository);
        cycleRepo = module.get(CycleRepository);
        questionRepo = module.get(QuestionRepository);
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
        hrId = hr.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    async function seedCycleAndReview(
        title: string,
    ): Promise<{ cycleId: number; reviewId: number; rateeId: number }> {
        const ratee = await identityUsers.create({
            firstName: 'Robert',
            lastName: 'Smith',
            email: `ratee.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const position = await positionRepo.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title,
                hrId,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        const review = await reviewRepo.create(
            ReviewDomain.create({
                rateeId: ratee.id!,
                rateeFullName: 'Robert Smith',
                rateePositionId: position.id!,
                rateePositionTitle: 'Engineer',
                hrId,
                hrFullName: 'Helena Reed',
                cycleId: cycle.id!,
                stage: ReviewStage.FINISHED,
            }),
        );
        return { cycleId: cycle.id!, reviewId: review.id!, rateeId: ratee.id! };
    }

    /**
     * Seeds a Report tied to (reviewId, cycleId). If `withCompetence` is
     * true, also seeds a Competence (the strategic-report generator
     * requires at least one competence on the cycle side for its
     * insight rows to satisfy the competence FK), an associated Question,
     * and a single ReportAnalytics row referencing the competence — that
     * gives `buildStrategicAnalyticPayload` something to aggregate.
     */
    async function seedReport(
        reviewId: number,
        cycleId: number,
        withCompetence: boolean = false,
    ): Promise<{ reportId: number; competenceId?: number }> {
        const report = await reportRepo.create(
            ReportDomain.create({
                reviewId,
                cycleId,
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

        if (!withCompetence) {
            return { reportId: report.id! };
        }

        const competence = await competenceRepo.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        const question = await questionRepo.create(
            QuestionDomain.create({
                cycleId,
                title: 'Rate teamwork',
                answerType: AnswerType.NUMERICAL_SCALE,
                competenceId: competence.id!,
            }),
        );
        // The strategic-report generator discovers competences for a
        // cycle by walking each review's answers → question → competence.
        // Without at least one answer, `allCompetences` ends up empty and
        // the insight rows fall back to `competenceId: -1` (FK violation).
        await answerRepo.create(
            AnswerDomain.create({
                reviewId,
                questionId: question.id!,
                respondentCategory: RespondentCategory.TEAM,
                answerType: AnswerType.NUMERICAL_SCALE,
                numericalValue: 4,
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
        return { reportId: report.id!, competenceId: competence.id! };
    }

    function buildStrategicReport(cycleId: number): StrategicReportDomain {
        return StrategicReportDomain.create({
            cycleId,
            cycleTitle: 'Cycle',
            rateeCount: 1,
            rateeIds: [],
            respondentCount: 3,
            respondentIds: [],
            answerCount: 12,
            reviewerCount: 0,
            reviewerIds: [],
            teamCount: 0,
            teamIds: [],
            positionCount: 1,
            positionIds: [],
            competenceCount: 0,
            competenceIds: [],
            questionCount: 0,
            questionIds: [],
        });
    }

    function hrActor(): UserDomain {
        return UserDomain.create({
            id: hrId,
            firstName: 'H',
            lastName: 'R',
            email: 'hr@example.com',
            roles: [IdentityRole.HR],
        });
    }

    describe('search / checkAccessToAllStrategicReports', () => {
        it('returns persisted strategic reports for an HR actor', async () => {
            const { cycleId } = await seedCycleAndReview('Cycle A');
            await strategicRepo.create(buildStrategicReport(cycleId));

            const result = await service.search({} as any, hrActor());

            expect(result).toHaveLength(1);
        });

        it('throws ForbiddenException for an unprivileged actor', async () => {
            const otherId = (
                await identityUsers.create({
                    firstName: 'Other',
                    lastName: 'P',
                    email: `o.${Date.now()}.${Math.random()}@example.com`,
                } as any)
            ).id!;
            const stranger = UserDomain.create({
                id: otherId,
                firstName: 'X',
                lastName: 'Y',
                email: 'x@example.com',
                roles: [IdentityRole.EMPLOYEE],
            });

            await expect(
                service.search({} as any, stranger),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });
    });

    describe('getById / getByCycleId', () => {
        it('getById returns the report for an HR actor', async () => {
            const { cycleId } = await seedCycleAndReview('Cycle A');
            const created = await strategicRepo.create(
                buildStrategicReport(cycleId),
            );

            const result = await service.getById(created.id!, hrActor());

            expect(result.cycleId).toBe(cycleId);
        });

        it('getById throws NotFoundException when missing', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('getByCycleId returns the report tied to a cycle', async () => {
            const { cycleId } = await seedCycleAndReview('Cycle A');
            await strategicRepo.create(buildStrategicReport(cycleId));

            const result = await service.getByCycleId(cycleId, hrActor());

            expect(result.cycleId).toBe(cycleId);
        });

        it('getByCycleId throws NotFoundException when no report exists', async () => {
            const { cycleId } = await seedCycleAndReview('Cycle A');

            await expect(
                service.getByCycleId(cycleId, hrActor()),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('generateStrategicReportForCycle', () => {
        it('creates a strategic report aggregating individual reports for a cycle', async () => {
            const { cycleId, reviewId } = await seedCycleAndReview('Cycle A');
            await seedReport(reviewId, cycleId, true);

            const created =
                await service.generateStrategicReportForCycle(cycleId);

            expect(created.id).toBeDefined();
            expect(created.cycleId).toBe(cycleId);
            expect(created.cycleTitle).toBe('Cycle A');
            expect(created.competenceCount).toBeGreaterThan(0);

            const fromDb = await strategicRepo.findByCycleId(cycleId);
            expect(fromDb).not.toBeNull();
            expect(fromDb!.id).toBe(created.id);
        });

        it('returns the existing strategic report if one is already persisted', async () => {
            const { cycleId, reviewId } = await seedCycleAndReview('Cycle A');
            await seedReport(reviewId, cycleId);
            const existing = await strategicRepo.create(
                buildStrategicReport(cycleId),
            );

            const result =
                await service.generateStrategicReportForCycle(cycleId);

            expect(result.id).toBe(existing.id);
        });

        it('throws NotFoundException when the cycle is missing', async () => {
            await expect(
                service.generateStrategicReportForCycle(999999),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('throws NotFoundException when no individual reports exist for the cycle', async () => {
            const { cycleId } = await seedCycleAndReview('Cycle A');

            await expect(
                service.generateStrategicReportForCycle(cycleId),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
