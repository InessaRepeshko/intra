import '../../../setup-env';

import {
    EntityType,
    IdentityRole,
    RespondentCategory,
    ReviewStage,
} from '@intra/shared-kernel';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { ReportAnalyticsService } from 'src/contexts/reporting/application/services/report-analytics.service';
import { ReportAnalyticsDomain } from 'src/contexts/reporting/domain/report-analytics.domain';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { ReportAnalyticsRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report-analytics.repository';
import { ReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('ReportAnalyticsService (integration)', () => {
    let module: TestingModule;
    let service: ReportAnalyticsService;
    let analyticsRepo: ReportAnalyticsRepository;
    let reportRepo: ReportRepository;
    let reviewRepo: ReviewRepository;
    let cycleRepo: CycleRepository;
    let positionRepo: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let hrId: number;
    let reportId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        service = module.get(ReportAnalyticsService);
        analyticsRepo = module.get(ReportAnalyticsRepository);
        reportRepo = module.get(ReportRepository);
        reviewRepo = module.get(ReviewRepository);
        cycleRepo = module.get(CycleRepository);
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
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
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
                hrId: hr.id!,
                hrFullName: 'Helena Reed',
                cycleId: cycle.id!,
                stage: ReviewStage.FINISHED,
            }),
        );
        const report = await reportRepo.create(
            ReportDomain.create({
                reviewId: review.id!,
                cycleId: cycle.id!,
                respondentCount: 3,
                respondentCategories: [RespondentCategory.TEAM],
                answerCount: 6,
                analytics: [],
            }),
        );

        hrId = hr.id!;
        reportId = report.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function hrActor(): UserDomain {
        return UserDomain.create({
            id: hrId,
            firstName: 'H',
            lastName: 'R',
            email: 'hr@example.com',
            roles: [IdentityRole.HR],
        });
    }

    async function seedAnalytics() {
        await analyticsRepo.createMany(reportId, [
            ReportAnalyticsDomain.create({
                reportId,
                entityType: EntityType.COMPETENCE,
                questionId: null,
                questionTitle: null,
                competenceId: null,
                competenceTitle: 'Teamwork',
                averageByTeam: 3.7,
            }),
        ]);
    }

    describe('getByReportId', () => {
        it('returns analytics tied to the report when access is allowed', async () => {
            await seedAnalytics();

            const result = await service.getByReportId(reportId, hrActor());

            expect(result).toHaveLength(1);
            expect(result[0].competenceTitle).toBe('Teamwork');
        });

        it('returns an empty array when no analytics rows exist (access still checked)', async () => {
            // findByReportId returns [] which is truthy; the explicit null
            // check in the service therefore never fires.
            await expect(
                service.getByReportId(reportId, hrActor()),
            ).resolves.toEqual([]);
        });

        it('delegates access check to ReportingService (NotFound when report missing)', async () => {
            await expect(
                service.getByReportId(999999, hrActor()),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('delegates access check to ReportingService (Forbidden for unrelated actor)', async () => {
            const otherId = (
                await identityUsers.create({
                    firstName: 'X',
                    lastName: 'Y',
                    email: `x.${Date.now()}.${Math.random()}@example.com`,
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
                service.getByReportId(reportId, stranger),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });
    });

    describe('getById', () => {
        it('returns the analytics row when found and the actor has access', async () => {
            await seedAnalytics();
            const stored = await prisma.reportAnalytics.findFirst({
                where: { reportId },
            });

            const result = await service.getById(stored!.id, hrActor());

            expect(result.id).toBe(stored!.id);
        });

        it('throws NotFoundException when analytics id is missing', async () => {
            await expect(
                service.getById(999999, hrActor()),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});
