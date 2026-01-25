import {
    PrismaClient,
    RespondentCategory as PrismaRespondentCategory,
    ResponseStatus as PrismaResponseStatus
} from '@intra/database';
import { RespondentCategory, ResponseStatus } from '@intra/shared-kernel';
import type { ReviewMap } from './reviews';
import type { UserMap } from '../identity/users';

type RespondentSeed = {
    rateeEmail: string;
    cycleTitle: string;
    respondentEmails: string[];
    category: RespondentCategory;
    responseStatus: ResponseStatus;
};

// Define respondents for each review across all cycles
export const RESPONDENT_SEED_DATA: RespondentSeed[] = [
    // ===== Mid-Year Performance Review 2025 =====
    // Serhii Oliinyk - Team Lead
    {
        rateeEmail: 'serhii.oliinyk@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['serhii.oliinyk@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'serhii.oliinyk@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['pavlo.lytvyn@intra.com', 'taras.rudenko@intra.com', 'petro.koval@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'serhii.oliinyk@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['viktoria.moroz@intra.com', 'dmytro.kovalenko@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Pavlo Lytvyn - Tech Lead
    {
        rateeEmail: 'pavlo.lytvyn@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['pavlo.lytvyn@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'pavlo.lytvyn@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['taras.rudenko@intra.com', 'petro.koval@intra.com', 'ivan.sydorenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'pavlo.lytvyn@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['viktoria.moroz@intra.com', 'olga.ivanchuk@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Viktoria Moroz - Team Lead (QA)
    {
        rateeEmail: 'viktoria.moroz@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['viktoria.moroz@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'viktoria.moroz@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['oksana.savchenko@intra.com', 'tetiana.bondar@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'viktoria.moroz@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['serhii.oliinyk@intra.com', 'pavlo.lytvyn@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Olga Ivanchuk - Senior Designer
    {
        rateeEmail: 'olga.ivanchuk@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['olga.ivanchuk@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'olga.ivanchuk@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['kateryna.romanchuk@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'olga.ivanchuk@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['pavlo.lytvyn@intra.com', 'taras.rudenko@intra.com', 'oksana.savchenko@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Natalya Tkachenko - HR Director
    {
        rateeEmail: 'natalya.tkachenko@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['natalya.tkachenko@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'natalya.tkachenko@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['mariia.pavlenko@intra.com', 'yulia.kravchenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'natalya.tkachenko@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['iryna.shevchenko@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Dmytro Kovalenko - CTO
    {
        rateeEmail: 'dmytro.kovalenko@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['dmytro.kovalenko@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'dmytro.kovalenko@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['serhii.oliinyk@intra.com', 'viktoria.moroz@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'dmytro.kovalenko@intra.com',
        cycleTitle: 'Mid-Year Performance Review 2025',
        respondentEmails: ['oleksandr.bondarenko@intra.com', 'iryna.shevchenko@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // ===== Annual Performance Review 2025 =====
    // Taras Rudenko - Senior Software Engineer
    {
        rateeEmail: 'taras.rudenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['taras.rudenko@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'taras.rudenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['petro.koval@intra.com', 'ivan.sydorenko@intra.com', 'yevhenii.tkachuk@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'taras.rudenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['oksana.savchenko@intra.com', 'olga.ivanchuk@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Petro Koval - Senior Software Engineer
    {
        rateeEmail: 'petro.koval@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['petro.koval@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'petro.koval@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['taras.rudenko@intra.com', 'ivan.sydorenko@intra.com', 'mykola.petrenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'petro.koval@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['tetiana.bondar@intra.com', 'kateryna.romanchuk@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Ivan Sydorenko - Middle Software Engineer
    {
        rateeEmail: 'ivan.sydorenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['ivan.sydorenko@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'ivan.sydorenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['yevhenii.tkachuk@intra.com', 'mykola.petrenko@intra.com', 'taras.rudenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'ivan.sydorenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['oksana.savchenko@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Oksana Savchenko - Senior QA Engineer
    {
        rateeEmail: 'oksana.savchenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['oksana.savchenko@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'oksana.savchenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['tetiana.bondar@intra.com', 'vasyl.lysenko@intra.com', 'viktoria.moroz@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'oksana.savchenko@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['taras.rudenko@intra.com', 'pavlo.lytvyn@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Tetiana Bondar - Middle QA Engineer
    {
        rateeEmail: 'tetiana.bondar@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['tetiana.bondar@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'tetiana.bondar@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['oksana.savchenko@intra.com', 'vasyl.lysenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Kateryna Romanchuk - Middle Designer
    {
        rateeEmail: 'kateryna.romanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['kateryna.romanchuk@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'kateryna.romanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['olga.ivanchuk@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'kateryna.romanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['ivan.sydorenko@intra.com', 'petro.koval@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Yevhenii Tkachuk - Middle Software Engineer
    {
        rateeEmail: 'yevhenii.tkachuk@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['yevhenii.tkachuk@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'yevhenii.tkachuk@intra.com',
        cycleTitle: 'Annual Performance Review 2025',
        respondentEmails: ['ivan.sydorenko@intra.com', 'petro.koval@intra.com', 'taras.rudenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // ===== Annual Performance Review 2026 =====
    // Same data as previously defined...
    // Taras Rudenko - Senior Software Engineer
    {
        rateeEmail: 'taras.rudenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['taras.rudenko@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'taras.rudenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['petro.koval@intra.com', 'ivan.sydorenko@intra.com', 'yevhenii.tkachuk@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'taras.rudenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['oksana.savchenko@intra.com', 'olga.ivanchuk@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Petro Koval - Senior Software Engineer
    {
        rateeEmail: 'petro.koval@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['petro.koval@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'petro.koval@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['taras.rudenko@intra.com', 'ivan.sydorenko@intra.com', 'mykola.petrenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'petro.koval@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['tetiana.bondar@intra.com', 'kateryna.romanchuk@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.IN_PROGRESS,
    },

    // Ivan Sydorenko - Middle Software Engineer
    {
        rateeEmail: 'ivan.sydorenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['ivan.sydorenko@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'ivan.sydorenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['yevhenii.tkachuk@intra.com', 'mykola.petrenko@intra.com', 'taras.rudenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'ivan.sydorenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['oksana.savchenko@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.PENDING,
    },

    // Yevhenii Tkachuk - Middle Software Engineer
    {
        rateeEmail: 'yevhenii.tkachuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['yevhenii.tkachuk@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'yevhenii.tkachuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['ivan.sydorenko@intra.com', 'petro.koval@intra.com', 'taras.rudenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.IN_PROGRESS,
    },

    // Mykola Petrenko - Junior Software Engineer
    {
        rateeEmail: 'mykola.petrenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['mykola.petrenko@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'mykola.petrenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['ivan.sydorenko@intra.com', 'yevhenii.tkachuk@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Pavlo Lytvyn - Tech Lead
    {
        rateeEmail: 'pavlo.lytvyn@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['pavlo.lytvyn@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'pavlo.lytvyn@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['taras.rudenko@intra.com', 'petro.koval@intra.com', 'ivan.sydorenko@intra.com', 'yevhenii.tkachuk@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'pavlo.lytvyn@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['viktoria.moroz@intra.com', 'olga.ivanchuk@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Serhii Oliinyk - Team Lead
    {
        rateeEmail: 'serhii.oliinyk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['serhii.oliinyk@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'serhii.oliinyk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['pavlo.lytvyn@intra.com', 'taras.rudenko@intra.com', 'petro.koval@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'serhii.oliinyk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['viktoria.moroz@intra.com', 'olga.ivanchuk@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.IN_PROGRESS,
    },

    // Oksana Savchenko - Senior QA Engineer
    {
        rateeEmail: 'oksana.savchenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['oksana.savchenko@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'oksana.savchenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['tetiana.bondar@intra.com', 'vasyl.lysenko@intra.com', 'viktoria.moroz@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'oksana.savchenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['taras.rudenko@intra.com', 'pavlo.lytvyn@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Tetiana Bondar - Middle QA Engineer
    {
        rateeEmail: 'tetiana.bondar@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['tetiana.bondar@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'tetiana.bondar@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['oksana.savchenko@intra.com', 'vasyl.lysenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.IN_PROGRESS,
    },

    // Vasyl Lysenko - Junior QA Engineer
    {
        rateeEmail: 'vasyl.lysenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['vasyl.lysenko@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'vasyl.lysenko@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['tetiana.bondar@intra.com', 'oksana.savchenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Viktoria Moroz - Team Lead (QA)
    {
        rateeEmail: 'viktoria.moroz@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['viktoria.moroz@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'viktoria.moroz@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['oksana.savchenko@intra.com', 'tetiana.bondar@intra.com', 'vasyl.lysenko@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'viktoria.moroz@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['serhii.oliinyk@intra.com', 'pavlo.lytvyn@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Olga Ivanchuk - Senior Designer
    {
        rateeEmail: 'olga.ivanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['olga.ivanchuk@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'olga.ivanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['kateryna.romanchuk@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'olga.ivanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['pavlo.lytvyn@intra.com', 'taras.rudenko@intra.com', 'oksana.savchenko@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.COMPLETED,
    },

    // Kateryna Romanchuk - Middle Designer
    {
        rateeEmail: 'kateryna.romanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['kateryna.romanchuk@intra.com'],
        category: RespondentCategory.SELF_ASSESSMENT,
        responseStatus: ResponseStatus.COMPLETED,
    },
    {
        rateeEmail: 'kateryna.romanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['olga.ivanchuk@intra.com'],
        category: RespondentCategory.TEAM,
        responseStatus: ResponseStatus.IN_PROGRESS,
    },
    {
        rateeEmail: 'kateryna.romanchuk@intra.com',
        cycleTitle: 'Annual Performance Review 2026',
        respondentEmails: ['ivan.sydorenko@intra.com', 'petro.koval@intra.com'],
        category: RespondentCategory.OTHER,
        responseStatus: ResponseStatus.PENDING,
    },
];

export default async function seedRespondents(
    prisma: PrismaClient,
    reviewMap: ReviewMap,
    userMap: UserMap,
) {
    for (const data of RESPONDENT_SEED_DATA) {
        // Find the review using cycle:email as key
        const mapKey = `${data.cycleTitle}:${data.rateeEmail}`;
        const reviewRef = reviewMap.get(mapKey);

        if (!reviewRef) {
            console.warn(`⚠️ Review for ${data.rateeEmail} in cycle "${data.cycleTitle}" not found`);
            continue;
        }

        for (const respondentEmail of data.respondentEmails) {
            const respondentUser = await prisma.user.findUnique({
                where: { email: respondentEmail },
            });

            if (!respondentUser) {
                console.warn(`⚠️ Respondent ${respondentEmail} not found`);
                continue;
            }

            // Get respondent position
            const position = respondentUser.positionId
                ? await prisma.position.findUnique({ where: { id: respondentUser.positionId } })
                : null;

            if (!position) {
                console.warn(`⚠️ Position for ${respondentEmail} not found`);
                continue;
            }

            const existing = await prisma.respondent.findUnique({
                where: {
                    respondentId_reviewId: {
                        respondentId: respondentUser.id,
                        reviewId: reviewRef.id,
                    },
                },
            });

            if (existing) continue;

            // Set dates based on cycle and response status
            let invitedAt: Date;
            let respondedAt: Date | null = null;
            let canceledAt: Date | null = null;

            if (data.cycleTitle === 'Mid-Year Performance Review 2025') {
                invitedAt = new Date('2025-05-02T10:00:00Z');
                if (data.responseStatus === ResponseStatus.COMPLETED) {
                    respondedAt = new Date('2025-05-18T14:30:00Z');
                }
            } else if (data.cycleTitle === 'Annual Performance Review 2025') {
                invitedAt = new Date('2025-11-02T10:00:00Z');
                if (data.responseStatus === ResponseStatus.COMPLETED) {
                    respondedAt = new Date('2025-11-18T16:00:00Z');
                }
            } else {
                // 2026 cycle
                invitedAt = new Date('2026-01-16T10:00:00Z');
                if (data.responseStatus === ResponseStatus.COMPLETED) {
                    respondedAt = new Date('2026-01-20T15:30:00Z');
                }
            }

            await prisma.respondent.create({
                data: {
                    reviewId: reviewRef.id,
                    respondentId: respondentUser.id,
                    category: data.category.toString().toUpperCase() as unknown as PrismaRespondentCategory,
                    responseStatus: data.responseStatus.toString().toUpperCase() as unknown as PrismaResponseStatus,
                    positionId: position.id,
                    positionTitle: position.title,
                    invitedAt,
                    respondedAt,
                    canceledAt,
                },
            });
        }
    }
}
