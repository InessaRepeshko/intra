import '../../../setup-env';

import {
    RespondentCategory,
    RespondentSortField,
    ResponseStatus,
    ReviewStage,
    SortDirection,
} from '@intra/shared-kernel';
import { NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { RespondentRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/respondent.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('RespondentRepository (integration)', () => {
    let module: TestingModule;
    let repo: RespondentRepository;
    let reviews: ReviewRepository;
    let cycles: CycleRepository;
    let positions: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let reviewId: number;
    let respondentUserId: number;
    let positionId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        repo = module.get(RespondentRepository);
        reviews = module.get(ReviewRepository);
        cycles = module.get(CycleRepository);
        positions = module.get(PositionRepository);
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
        const respondentUser = await identityUsers.create({
            firstName: 'Sara',
            lastName: 'Lopez',
            email: `respondent.${Date.now()}@example.com`,
        } as any);
        const position = await positions.create(
            PositionDomain.create({ title: 'Engineer' }),
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
                stage: ReviewStage.NEW,
            }),
        );

        reviewId = review.id!;
        respondentUserId = respondentUser.id!;
        positionId = position.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    function buildRespondent(
        overrides: Partial<{
            category: RespondentCategory;
            responseStatus: ResponseStatus;
            fullName: string;
            respondentId: number;
        }> = {},
    ): RespondentDomain {
        return RespondentDomain.create({
            reviewId,
            respondentId: overrides.respondentId ?? respondentUserId,
            fullName: overrides.fullName ?? 'Sara Lopez',
            category: overrides.category ?? RespondentCategory.TEAM,
            responseStatus: overrides.responseStatus ?? ResponseStatus.PENDING,
            positionId,
            positionTitle: 'Engineer',
        });
    }

    async function newUserId(seed: string): Promise<number> {
        const user = await identityUsers.create({
            firstName: seed,
            lastName: 'Person',
            email: `${seed}.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        return user.id!;
    }

    describe('create / getById', () => {
        it('persists a respondent with defaults applied', async () => {
            const created = await repo.create(buildRespondent());

            expect(created.id).toBeDefined();
            expect(created.category).toBe(RespondentCategory.TEAM);
            expect(created.responseStatus).toBe(ResponseStatus.PENDING);
        });

        it('getById returns the respondent when found', async () => {
            const created = await repo.create(buildRespondent());

            await expect(repo.getById(created.id!)).resolves.toBeInstanceOf(
                RespondentDomain,
            );
        });

        it('getById throws NotFoundException when missing', async () => {
            await expect(repo.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('listByReview', () => {
        it('returns respondents filtered by category', async () => {
            const otherId = await newUserId('Robert');
            await repo.create(buildRespondent());
            await repo.create(
                buildRespondent({
                    category: RespondentCategory.SELF_ASSESSMENT,
                    fullName: 'Robert Smith',
                    respondentId: otherId,
                }),
            );

            const result = await repo.listByReview(reviewId, {
                category: RespondentCategory.SELF_ASSESSMENT,
            } as any);

            expect(result).toHaveLength(1);
            expect(result[0].fullName).toBe('Robert Smith');
        });

        it('returns respondents filtered by responseStatus', async () => {
            const otherId = await newUserId('Other');
            await repo.create(buildRespondent());
            await repo.create(
                buildRespondent({
                    responseStatus: ResponseStatus.COMPLETED,
                    fullName: 'Other Name',
                    respondentId: otherId,
                }),
            );

            const result = await repo.listByReview(reviewId, {
                responseStatus: ResponseStatus.COMPLETED,
            } as any);

            expect(result).toHaveLength(1);
            expect(result[0].fullName).toBe('Other Name');
        });

        it('honours sort direction', async () => {
            const aaId = await newUserId('Aa');
            const zzId = await newUserId('Zz');
            await repo.create(
                buildRespondent({
                    fullName: 'Aa Person',
                    respondentId: aaId,
                }),
            );
            await repo.create(
                buildRespondent({
                    fullName: 'Zz Person',
                    respondentId: zzId,
                }),
            );

            const result = await repo.listByReview(reviewId, {
                sortBy: RespondentSortField.FULL_NAME,
                sortDirection: SortDirection.DESC,
            } as any);

            expect(result.map((r) => r.fullName)).toEqual([
                'Zz Person',
                'Aa Person',
            ]);
        });
    });

    describe('updateById', () => {
        it('persists patched fields with enum conversion', async () => {
            const created = await repo.create(buildRespondent());

            const updated = await repo.updateById(created.id!, {
                responseStatus: ResponseStatus.COMPLETED,
                hrNote: 'completed on time',
            } as any);

            expect(updated.responseStatus).toBe(ResponseStatus.COMPLETED);
            expect(updated.hrNote).toBe('completed on time');
        });
    });

    describe('deleteById', () => {
        it('removes the respondent row', async () => {
            const created = await repo.create(buildRespondent());

            await repo.deleteById(created.id!);

            const fromDb = await prisma.respondent.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
