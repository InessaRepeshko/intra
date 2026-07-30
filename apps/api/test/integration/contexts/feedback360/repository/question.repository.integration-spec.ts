import '../../../setup-env';

import {
    AnswerType,
    QuestionSortField,
    SortDirection,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { QuestionDomain } from 'src/contexts/feedback360/domain/question.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { QuestionRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/question.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('QuestionRepository (integration)', () => {
    let module: TestingModule;
    let repo: QuestionRepository;
    let cycles: CycleRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let cycleId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        repo = module.get(QuestionRepository);
        cycles = module.get(CycleRepository);
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
        const cycle = await cycles.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );
        cycleId = cycle.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create / findById', () => {
        it('persists a new question with defaults applied', async () => {
            const created = await repo.create(
                QuestionDomain.create({
                    cycleId,
                    title: 'Rate teamwork',
                    answerType: AnswerType.NUMERICAL_SCALE,
                }),
            );

            expect(created.id).toBeDefined();
            expect(created.isForSelfassessment).toBe(false);
            expect(created.title).toBe('Rate teamwork');
        });

        it('findById returns the row when found', async () => {
            const created = await repo.create(
                QuestionDomain.create({
                    cycleId,
                    title: 'Q?',
                    answerType: AnswerType.TEXT_FIELD,
                }),
            );

            await expect(repo.findById(created.id!)).resolves.toBeInstanceOf(
                QuestionDomain,
            );
        });

        it('findById returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await repo.create(
                QuestionDomain.create({
                    cycleId,
                    title: 'Numeric Q',
                    answerType: AnswerType.NUMERICAL_SCALE,
                    isForSelfassessment: true,
                }),
            );
            await repo.create(
                QuestionDomain.create({
                    cycleId,
                    title: 'Text Q',
                    answerType: AnswerType.TEXT_FIELD,
                }),
            );
        });

        it('returns all questions when no filter is supplied', async () => {
            const all = await repo.search({} as any);
            expect(all).toHaveLength(2);
        });

        it('filters by cycleId', async () => {
            const result = await repo.search({ cycleId } as any);
            expect(result).toHaveLength(2);
        });

        it('filters by answerType', async () => {
            const result = await repo.search({
                answerType: AnswerType.TEXT_FIELD,
            } as any);
            expect(result.map((q) => q.title)).toEqual(['Text Q']);
        });

        it('filters by isForSelfassessment = true', async () => {
            const result = await repo.search({
                isForSelfassessment: true,
            } as any);
            expect(result.map((q) => q.title)).toEqual(['Numeric Q']);
        });

        it('filters by title (case insensitive substring)', async () => {
            const result = await repo.search({ title: 'NUMERIC' } as any);
            expect(result.map((q) => q.title)).toEqual(['Numeric Q']);
        });

        it('honours descending sort on title', async () => {
            const result = await repo.search({
                sortBy: QuestionSortField.TITLE,
                sortDirection: SortDirection.DESC,
            } as any);
            const titles = result.map((q) => q.title);
            expect(titles).toEqual([...titles].sort().reverse());
        });
    });

    describe('deleteById', () => {
        it('removes the question row', async () => {
            const created = await repo.create(
                QuestionDomain.create({
                    cycleId,
                    title: 'Q?',
                    answerType: AnswerType.TEXT_FIELD,
                }),
            );

            await repo.deleteById(created.id!);

            const fromDb = await prisma.question.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });
});
