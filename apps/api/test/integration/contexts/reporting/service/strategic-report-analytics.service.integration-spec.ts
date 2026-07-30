import '../../../setup-env';

import { IdentityRole, ReviewStage } from '@intra/shared-kernel';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetenceRepository } from 'src/contexts/library/infrastructure/prisma-repositories/competence.repository';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { StrategicReportAnalyticsService } from 'src/contexts/reporting/application/services/strategic-report-analytics.service';
import { StrategicReportAnalyticsDomain } from 'src/contexts/reporting/domain/strategic-report-analytics.domain';
import { StrategicReportDomain } from 'src/contexts/reporting/domain/strategic-report.domain';
import { StrategicReportAnalyticsRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/strategic-report-analytics.repository';
import { StrategicReportRepository } from 'src/contexts/reporting/infrastructure/prisma-repositories/strategic-report.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createReportingTestModule,
    resetReportingTables,
} from '../test-app-reporting';

describe('StrategicReportAnalyticsService (integration)', () => {
    let module: TestingModule;
    let service: StrategicReportAnalyticsService;
    let analyticsRepo: StrategicReportAnalyticsRepository;
    let strategicRepo: StrategicReportRepository;
    let cycleRepo: CycleRepository;
    let reviewRepo: ReviewRepository;
    let competenceRepo: CompetenceRepository;
    let positionRepo: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let hrId: number;
    let strategicReportId: number;
    let competenceId: number;

    beforeAll(async () => {
        module = await createReportingTestModule();
        service = module.get(StrategicReportAnalyticsService);
        analyticsRepo = module.get(StrategicReportAnalyticsRepository);
        strategicRepo = module.get(StrategicReportRepository);
        cycleRepo = module.get(CycleRepository);
        reviewRepo = module.get(ReviewRepository);
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
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        // Strategic-report access check resolves reviews by cycleId
        // before the role check — without one, an unprivileged actor
        // would hit NotFoundException instead of ForbiddenException.
        await reviewRepo.create(
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
        const competence = await competenceRepo.create(
            CompetenceDomain.create({ title: 'Teamwork' }),
        );
        const strategicReport = await strategicRepo.create(
            StrategicReportDomain.create({
                cycleId: cycle.id!,
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
                positionCount: 0,
                positionIds: [],
                competenceCount: 1,
                competenceIds: [competence.id!],
                questionCount: 0,
                questionIds: [],
            }),
        );

        hrId = hr.id!;
        strategicReportId = strategicReport.id!;
        competenceId = competence.id!;
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
        await analyticsRepo.createMany(strategicReportId, [
            StrategicReportAnalyticsDomain.create({
                strategicReportId,
                competenceId,
                competenceTitle: 'Teamwork',
                averageByTeam: 3.5,
                averageByOther: 4.0,
            }),
        ]);
    }

    describe('getByStrategicReportId', () => {
        it('returns analytics tied to the strategic report for an HR actor', async () => {
            await seedAnalytics();

            const result = await service.getByStrategicReportId(
                strategicReportId,
                hrActor(),
            );

            expect(result).toHaveLength(1);
            expect(result[0].competenceTitle).toBe('Teamwork');
        });

        it('returns an empty array when no analytics exist (access still checked)', async () => {
            await expect(
                service.getByStrategicReportId(strategicReportId, hrActor()),
            ).resolves.toEqual([]);
        });

        it('throws NotFoundException when strategic report is missing', async () => {
            await expect(
                service.getByStrategicReportId(999999, hrActor()),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('throws ForbiddenException for an unprivileged actor', async () => {
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
                service.getByStrategicReportId(strategicReportId, stranger),
            ).rejects.toBeInstanceOf(ForbiddenException);
        });
    });

    describe('getById', () => {
        it('returns the analytics row when found and the actor has access', async () => {
            await seedAnalytics();
            const stored = await prisma.strategicReportAnalytics.findFirst({
                where: { strategicReportId },
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
