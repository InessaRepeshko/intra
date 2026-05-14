import { Cycle as PrismaCycle } from '@intra/database';
import { CycleStage } from '@intra/shared-kernel';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { CycleMapper } from 'src/contexts/feedback360/infrastructure/mappers/cycle.mapper';

describe('CycleMapper', () => {
    const prismaCycle: PrismaCycle = {
        id: 1,
        title: 'Q1 2025',
        description: 'First cycle',
        hrId: 7,
        minRespondentsThreshold: 5,
        stage: 'NEW' as PrismaCycle['stage'],
        isActive: true,
        startDate: new Date('2025-01-01T00:00:00.000Z'),
        reviewDeadline: new Date('2025-02-01T00:00:00.000Z'),
        approvalDeadline: new Date('2025-02-15T00:00:00.000Z'),
        responseDeadline: new Date('2025-03-01T00:00:00.000Z'),
        endDate: new Date('2025-03-31T00:00:00.000Z'),
        createdAt: new Date('2024-12-31T00:00:00.000Z'),
        updatedAt: new Date('2024-12-31T01:00:00.000Z'),
    } as PrismaCycle;

    describe('toDomain', () => {
        it('converts a prisma row into a CycleDomain instance', () => {
            const domain = CycleMapper.toDomain(prismaCycle);

            expect(domain).toBeInstanceOf(CycleDomain);
            expect(domain.id).toBe(1);
            expect(domain.title).toBe('Q1 2025');
            expect(domain.description).toBe('First cycle');
            expect(domain.hrId).toBe(7);
            expect(domain.minRespondentsThreshold).toBe(5);
            expect(domain.stage).toBe(CycleStage.NEW);
            expect(domain.isActive).toBe(true);
            expect(domain.startDate).toEqual(prismaCycle.startDate);
            expect(domain.endDate).toEqual(prismaCycle.endDate);
        });

        it('treats null isActive as true', () => {
            const domain = CycleMapper.toDomain({
                ...prismaCycle,
                isActive: null,
            } as unknown as PrismaCycle);
            expect(domain.isActive).toBe(true);
        });
    });

    describe('toPrisma', () => {
        it('serialises a CycleDomain into a Prisma create input', () => {
            const domain = CycleDomain.create({
                title: 'Q2 2025',
                description: null,
                hrId: 3,
                minRespondentsThreshold: 6,
                stage: CycleStage.ACTIVE,
                isActive: false,
                startDate: new Date('2025-04-01T00:00:00.000Z'),
                reviewDeadline: null,
                approvalDeadline: null,
                responseDeadline: null,
                endDate: new Date('2025-06-30T00:00:00.000Z'),
            });

            const prisma = CycleMapper.toPrisma(domain);

            expect(prisma).toEqual({
                title: 'Q2 2025',
                description: null,
                hrId: 3,
                minRespondentsThreshold: 6,
                stage: 'ACTIVE',
                isActive: false,
                startDate: new Date('2025-04-01T00:00:00.000Z'),
                reviewDeadline: null,
                approvalDeadline: null,
                responseDeadline: null,
                endDate: new Date('2025-06-30T00:00:00.000Z'),
            });
        });
    });

    describe('stage conversions', () => {
        it('uppercases the stage when going to Prisma', () => {
            expect(CycleMapper.toPrismaStage(CycleStage.NEW)).toBe('NEW');
            expect(CycleMapper.toPrismaStage(CycleStage.ARCHIVED)).toBe(
                'ARCHIVED',
            );
        });

        it('uppercases the stage when coming from Prisma', () => {
            expect(
                CycleMapper.fromPrismaStage(
                    'PREPARING_REPORT' as PrismaCycle['stage'],
                ),
            ).toBe(CycleStage.PREPARING_REPORT);
        });
    });
});
