import { PrismaClient } from '@intra/database';
import type { ReviewMap } from './reviews';
import type { UserMap } from '../identity/users';

type ReviewerSeed = {
    rateeEmail: string;
    cycleTitle: string;
    reviewerEmails: string[];
};

// Define reviewers (people who can see the review results)
// Typically this includes the ratee themselves, their manager, and HR
export const REVIEWER_SEED_DATA: ReviewerSeed[] = [
    // ===== Mid-Year Performance Review 2025 =====
    {
        rateeEmail: 'serhii.oliinyk@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        reviewerEmails: ['serhii.oliinyk@intra.com', 'dmytro.kovalenko@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'pavlo.lytvyn@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        reviewerEmails: ['pavlo.lytvyn@intra.com', 'serhii.oliinyk@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'viktoria.moroz@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        reviewerEmails: ['viktoria.moroz@intra.com', 'dmytro.kovalenko@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'olga.ivanchuk@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        reviewerEmails: ['olga.ivanchuk@intra.com', 'andrii.melnyk@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'natalya.tkachenko@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        reviewerEmails: ['natalya.tkachenko@intra.com', 'iryna.shevchenko@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'dmytro.kovalenko@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        reviewerEmails: ['dmytro.kovalenko@intra.com', 'oleksandr.bondarenko@intra.com', 'mariia.pavlenko@intra.com'],
    },

    // ===== Annual Performance Review 2025 =====
    {
        rateeEmail: 'taras.rudenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        reviewerEmails: ['taras.rudenko@intra.com', 'pavlo.lytvyn@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'petro.koval@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        reviewerEmails: ['petro.koval@intra.com', 'pavlo.lytvyn@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'ivan.sydorenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        reviewerEmails: ['ivan.sydorenko@intra.com', 'pavlo.lytvyn@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'oksana.savchenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        reviewerEmails: ['oksana.savchenko@intra.com', 'viktoria.moroz@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'tetiana.bondar@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        reviewerEmails: ['tetiana.bondar@intra.com', 'viktoria.moroz@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'kateryna.romanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        reviewerEmails: ['kateryna.romanchuk@intra.com', 'olga.ivanchuk@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'yevhenii.tkachuk@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        reviewerEmails: ['yevhenii.tkachuk@intra.com', 'pavlo.lytvyn@intra.com', 'mariia.pavlenko@intra.com'],
    },

    // ===== Annual Performance Review 2026 =====
    {
        rateeEmail: 'taras.rudenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['taras.rudenko@intra.com', 'pavlo.lytvyn@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'petro.koval@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['petro.koval@intra.com', 'pavlo.lytvyn@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'ivan.sydorenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['ivan.sydorenko@intra.com', 'pavlo.lytvyn@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'yevhenii.tkachuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['yevhenii.tkachuk@intra.com', 'pavlo.lytvyn@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'mykola.petrenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['mykola.petrenko@intra.com', 'ivan.sydorenko@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'pavlo.lytvyn@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['pavlo.lytvyn@intra.com', 'serhii.oliinyk@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'serhii.oliinyk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['serhii.oliinyk@intra.com', 'dmytro.kovalenko@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'oksana.savchenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['oksana.savchenko@intra.com', 'viktoria.moroz@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'tetiana.bondar@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['tetiana.bondar@intra.com', 'viktoria.moroz@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'vasyl.lysenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['vasyl.lysenko@intra.com', 'viktoria.moroz@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'viktoria.moroz@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['viktoria.moroz@intra.com', 'dmytro.kovalenko@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'olga.ivanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['olga.ivanchuk@intra.com', 'andrii.melnyk@intra.com', 'mariia.pavlenko@intra.com'],
    },
    {
        rateeEmail: 'kateryna.romanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        reviewerEmails: ['kateryna.romanchuk@intra.com', 'olga.ivanchuk@intra.com', 'mariia.pavlenko@intra.com'],
    },
];

export default async function seedReviewers(
    prisma: PrismaClient,
    reviewMap: ReviewMap,
    userMap: UserMap,
) {
    for (const data of REVIEWER_SEED_DATA) {
        const mapKey = `${data.cycleTitle}:${data.rateeEmail}`;
        const reviewRef = reviewMap.get(mapKey);

        if (!reviewRef) {
            console.warn(`⚠️ Review for ${data.rateeEmail} in cycle "${data.cycleTitle}" not found`);
            continue;
        }

        for (const reviewerEmail of data.reviewerEmails) {
            const reviewerUser = await prisma.user.findUnique({
                where: { email: reviewerEmail },
            });

            if (!reviewerUser) {
                console.warn(`⚠️ Reviewer ${reviewerEmail} not found`);
                continue;
            }

            // Get reviewer position
            const position = reviewerUser.positionId
                ? await prisma.position.findUnique({ where: { id: reviewerUser.positionId } })
                : null;

            if (!position) {
                console.warn(`⚠️ Position for ${reviewerEmail} not found`);
                continue;
            }

            const existing = await prisma.reviewer.findUnique({
                where: {
                    reviewId_reviewerId: {
                        reviewId: reviewRef.id,
                        reviewerId: reviewerUser.id,
                    },
                },
            });

            if (existing) continue;

            // Get reviewer team info
            const reviewerWithMemberships = await prisma.user.findUnique({
                where: { id: reviewerUser.id },
                include: {
                    memberships: {
                        where: { isPrimary: true },
                        include: { team: true }
                    }
                }
            });
            const reviewerTeam = reviewerWithMemberships?.memberships[0]?.team;
            const teamId = reviewerTeam?.id ?? null;
            const teamTitle = reviewerTeam?.title ?? null;

            await prisma.reviewer.create({
                data: {
                    reviewId: reviewRef.id,
                    reviewerId: reviewerUser.id,
                    fullName: reviewerUser.fullName || `${reviewerUser.firstName} ${reviewerUser.lastName}`,
                    positionId: position.id,
                    positionTitle: position.title,
                    teamId,
                    teamTitle,
                },
            });
        }
    }
}
