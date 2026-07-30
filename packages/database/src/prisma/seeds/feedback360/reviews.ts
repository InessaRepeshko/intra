import {
    PrismaClient,
    ReviewStage as PrismaReviewStage,
} from '@intra/database';
import { ReviewStage } from '@intra/shared-kernel';
import type { UserMap } from '../identity/users';
import type { CycleMap } from './cycles';

export type ReviewMap = Map<string, { id: number }>;

type ReviewSeed = {
    rateeEmail: string;
    cycleTitle: string;
    stage: ReviewStage;
    hrNote?: string | null;
};

// Reviews distributed across three cycles
export const REVIEW_SEED_DATA: ReviewSeed[] = [
    // ===== Mid-Year Performance Review 2025 (May-July) =====
    // Focus on leadership and management positions
    {
        rateeEmail: 'serhii.oliinyk@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'Strong H1 performance, team productivity increased by 20%',
    },
    {
        rateeEmail: 'pavlo.lytvyn@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'Excellent technical leadership in new architecture initiative',
    },
    {
        rateeEmail: 'viktoria.moroz@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'QA process improvements reduced bugs by 30%',
    },
    {
        rateeEmail: 'olga.ivanchuk@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'Led successful product redesign, positive user feedback',
    },
    {
        rateeEmail: 'natalya.tkachenko@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'HR initiatives improved employee satisfaction scores',
    },
    {
        rateeEmail: 'dmytro.kovalenko@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'CTO demonstrating strategic vision for tech stack evolution',
    },

    // ===== Annual Performance Review 2025 (Nov-Jan) =====
    // Focus on technical staff - completed reviews
    {
        rateeEmail: 'taras.rudenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'Outstanding year, delivered 3 major features with high quality',
    },
    {
        rateeEmail: 'petro.koval@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'Strong mentorship of junior developers, excellent code reviews',
    },
    {
        rateeEmail: 'ivan.sydorenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'Grew significantly, ready for senior promotion consideration',
    },
    {
        rateeEmail: 'oksana.savchenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'Created comprehensive test automation framework',
    },
    {
        rateeEmail: 'tetiana.bondar@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'Good progress in API testing and performance testing skills',
    },
    {
        rateeEmail: 'kateryna.romanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'Creative design solutions, strong collaboration with engineering',
    },
    {
        rateeEmail: 'yevhenii.tkachuk@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        stage: ReviewStage.PUBLISHED,
        hrNote: 'Solid year, consistent delivery on assigned tasks',
    },

    // ===== Annual Performance Review 2026 (Jan-Mar) =====
    // Current active cycle
    {
        rateeEmail: 'taras.rudenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Senior engineer showing strong technical leadership',
    },
    {
        rateeEmail: 'petro.koval@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Excellent code quality and mentoring skills',
    },
    {
        rateeEmail: 'ivan.sydorenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Growing into senior role, good collaboration',
    },
    {
        rateeEmail: 'yevhenii.tkachuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Solid mid-level engineer, ready for more responsibility',
    },
    {
        rateeEmail: 'mykola.petrenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Junior developer making good progress',
    },
    {
        rateeEmail: 'pavlo.lytvyn@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Tech lead with strong delivery track record',
    },
    {
        rateeEmail: 'serhii.oliinyk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Team lead demonstrating excellent people management',
    },
    {
        rateeEmail: 'oksana.savchenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Senior QA with deep quality expertise',
    },
    {
        rateeEmail: 'tetiana.bondar@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Mid-level QA showing initiative',
    },
    {
        rateeEmail: 'vasyl.lysenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Junior QA learning quickly',
    },
    {
        rateeEmail: 'viktoria.moroz@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'QA team lead maintaining high quality standards',
    },
    {
        rateeEmail: 'olga.ivanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Senior designer with excellent product thinking',
    },
    {
        rateeEmail: 'kateryna.romanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        stage: ReviewStage.IN_PROGRESS,
        hrNote: 'Mid-level designer with creative solutions',
    },
];

export default async function seedReviews(
    prisma: PrismaClient,
    userMap: UserMap,
    cycleMap: CycleMap,
): Promise<ReviewMap> {
    const reviewMap: ReviewMap = new Map();

    // HR user with id = 7
    const hrUser = await prisma.user.findUnique({ where: { id: 7 } });

    if (!hrUser) {
        console.warn('⚠️ HR user with id=7 not found, skipping reviews');
        return reviewMap;
    }

    for (const reviewData of REVIEW_SEED_DATA) {
        // Get the cycle for this review
        const cycle = await prisma.cycle.findFirst({
            where: { title: reviewData.cycleTitle },
        });

        if (!cycle) {
            console.warn(
                `⚠️ Cycle "${reviewData.cycleTitle}" not found, skipping review for ${reviewData.rateeEmail}`,
            );
            continue;
        }

        const rateeUser = await prisma.user.findUnique({
            where: { email: reviewData.rateeEmail },
            include: {
                teamHead: true,
                memberships: {
                    where: { isPrimary: true },
                    include: { team: true },
                },
            },
        });

        if (!rateeUser) {
            console.warn(
                `⚠️ User ${reviewData.rateeEmail} not found, skipping review`,
            );
            continue;
        }

        // Get ratee position
        const position = rateeUser.positionId
            ? await prisma.position.findUnique({
                  where: { id: rateeUser.positionId },
              })
            : null;

        if (!position) {
            console.warn(
                `⚠️ Position for user ${reviewData.rateeEmail} not found, skipping review`,
            );
            continue;
        }

        // Get team info
        const primaryTeam = rateeUser.memberships[0]?.team;
        const teamId = primaryTeam?.id ?? null;
        const teamTitle = primaryTeam?.title ?? null;

        // Get manager details if exists
        let managerFullName: string | null = null;
        let managerPositionId: number | null = null;
        let managerPositionTitle: string | null = null;

        if (rateeUser.managerId) {
            const manager = await prisma.user.findUnique({
                where: { id: rateeUser.managerId },
            });
            if (manager) {
                managerFullName =
                    manager.fullName ||
                    `${manager.firstName} ${manager.lastName}`;
                // If user has direct relation to position
                // Check schema: User has positionId.
                if (manager.positionId) {
                    const managerPos = await prisma.position.findUnique({
                        where: { id: manager.positionId },
                    });
                    if (managerPos) {
                        managerPositionId = managerPos.id;
                        managerPositionTitle = managerPos.title;
                    }
                }
            }
        }

        const existing = await prisma.review.findFirst({
            where: {
                rateeId: rateeUser.id,
                cycleId: cycle.id,
            },
        });

        // Use cycle:email as map key to support same employee across cycles
        const mapKey = `${reviewData.cycleTitle}:${reviewData.rateeEmail}`;

        const reviewDataPayload = {
            rateeId: rateeUser.id,
            rateeFullName:
                rateeUser.fullName ||
                `${rateeUser.firstName} ${rateeUser.lastName}`,
            rateePositionId: position.id,
            rateePositionTitle: position.title,
            hrId: hrUser.id,
            hrFullName:
                hrUser.fullName || `${hrUser.firstName} ${hrUser.lastName}`,
            hrNote: reviewData.hrNote,
            teamId,
            teamTitle,
            managerId: rateeUser.managerId,
            managerFullName,
            managerPositionId,
            managerPositionTitle,
            cycleId: cycle.id,
            reportId: null,
            stage: reviewData.stage
                .toString()
                .toUpperCase() as unknown as PrismaReviewStage,
        };

        const record = existing
            ? await prisma.review.update({
                  where: { id: existing.id },
                  data: reviewDataPayload,
              })
            : await prisma.review.create({
                  data: reviewDataPayload,
              });

        reviewMap.set(mapKey, { id: record.id });
    }

    return reviewMap;
}
