import { PrismaClient, CycleStage as PrismaCycleStage } from '@intra/database';
import { CycleStage } from '@intra/shared-kernel';
import type { UserMap } from '../identity/users';

export type CycleMap = Map<string, { id: number }>;

// Three feedback cycles: two completed cycles from 2025 and one active cycle for 2026
export const CYCLE_SEED_DATA = [
    {
        title: 'Mid-Year Performance Review 2025',
        description:
            'Mid-year 360-degree feedback cycle focusing on H1 2025 achievements and development areas',
        stage: CycleStage.ACTIVE,
        isActive: false,
        minRespondentsThreshold: 3,
        startDate: new Date('2025-05-01T09:00:00Z'),
        reviewDeadline: new Date('2025-05-20T23:59:59Z'),
        approvalDeadline: new Date('2025-06-05T23:59:59Z'),
        responseDeadline: new Date('2025-06-30T23:59:59Z'),
        endDate: new Date('2025-07-15T23:59:59Z'),
    },
    {
        title: 'Annual Performance Review 2025',
        description:
            'Year-end 360-degree feedback cycle for comprehensive 2025 performance evaluation',
        stage: CycleStage.ACTIVE,
        isActive: false,
        minRespondentsThreshold: 3,
        startDate: new Date('2025-11-01T09:00:00Z'),
        reviewDeadline: new Date('2025-11-20T23:59:59Z'),
        approvalDeadline: new Date('2025-12-05T23:59:59Z'),
        responseDeadline: new Date('2025-12-25T23:59:59Z'),
        endDate: new Date('2026-01-10T23:59:59Z'),
    },
    {
        title: 'Annual Performance Review 2026',
        description:
            'Annual 360-degree feedback cycle for evaluating employee performance, competencies, and growth opportunities',
        stage: CycleStage.ACTIVE,
        isActive: true,
        minRespondentsThreshold: 3,
        startDate: new Date('2026-01-15T09:00:00Z'),
        reviewDeadline: new Date('2026-02-01T23:59:59Z'),
        approvalDeadline: new Date('2026-02-15T23:59:59Z'),
        responseDeadline: new Date('2026-03-15T23:59:59Z'),
        endDate: new Date('2026-03-31T23:59:59Z'),
    },
];

export default async function seedCycles(
    prisma: PrismaClient,
    userMap: UserMap,
): Promise<CycleMap> {
    const cycleMap: CycleMap = new Map();

    // HR Manager with id = 7 (Mariia Pavlenko)
    const hrUser = await prisma.user.findUnique({ where: { id: 7 } });

    if (!hrUser) {
        console.warn('⚠️ HR user with id=7 not found, skipping cycle seeding');
        return cycleMap;
    }

    for (const cycle of CYCLE_SEED_DATA) {
        const existing = await prisma.cycle.findFirst({
            where: { title: cycle.title },
        });

        const record = existing
            ? await prisma.cycle.update({
                  where: { id: existing.id },
                  data: {
                      title: cycle.title,
                      description: cycle.description,
                      hrId: hrUser.id,
                      stage: cycle.stage
                          .toString()
                          .toUpperCase() as unknown as PrismaCycleStage,
                      isActive: cycle.isActive,
                      minRespondentsThreshold: cycle.minRespondentsThreshold,
                      startDate: cycle.startDate,
                      reviewDeadline: cycle.reviewDeadline,
                      approvalDeadline: cycle.approvalDeadline,
                      responseDeadline: cycle.responseDeadline,
                      endDate: cycle.endDate,
                  },
              })
            : await prisma.cycle.create({
                  data: {
                      title: cycle.title,
                      description: cycle.description,
                      hrId: hrUser.id,
                      stage: cycle.stage
                          .toString()
                          .toUpperCase() as unknown as PrismaCycleStage,
                      isActive: cycle.isActive,
                      minRespondentsThreshold: cycle.minRespondentsThreshold,
                      startDate: cycle.startDate,
                      reviewDeadline: cycle.reviewDeadline,
                      approvalDeadline: cycle.approvalDeadline,
                      responseDeadline: cycle.responseDeadline,
                      endDate: cycle.endDate,
                  },
              });

        cycleMap.set(cycle.title, { id: record.id });
    }

    return cycleMap;
}
