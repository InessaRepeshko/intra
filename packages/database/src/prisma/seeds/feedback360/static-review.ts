import {
    AnswerType,
    PrismaClient,
    RespondentCategory as PrismaRespondentCategory,
    ReviewStage as PrismaReviewStage,
} from '@intra/database';
import { RespondentCategory, ReviewStage } from '@intra/shared-kernel';

// Static data configuration
const STATIC_REVIEW_CONFIG = {
    cycleTitle: 'Annual Performance Review 2026',
    rateeEmail: 'petro.koval@intra.com', // HR Manager
    stage: ReviewStage.IN_PROGRESS,
    hrNote: 'Static review for testing purposes.',
    respondents: [
        {
            email: 'petro.koval@intra.com',
            category: RespondentCategory.SELF_ASSESSMENT,
            scores: [5, 4, 3, 2, 1, 5, 4, 3, 2, 1],
        },
        {
            email: 'ivan.sydorenko@intra.com',
            category: RespondentCategory.TEAM,
            scores: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
        },
        {
            email: 'yevhenii.tkachuk@intra.com',
            category: RespondentCategory.TEAM,
            scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        },
        {
            email: 'mykola.petrenko@intra.com',
            category: RespondentCategory.TEAM,
            scores: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        },
        {
            email: 'natalya.tkachenko@intra.com',
            category: RespondentCategory.OTHER,
            scores: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
        },
        {
            email: 'yulia.kravchenko@intra.com',
            category: RespondentCategory.OTHER,
            scores: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        },
    ],
    // Fixed answers for specific competencies/questions
    numericalScore: 4,
    textResponse: 'This is a static text response for testing.',
};

export default async function seedStaticReview(prisma: PrismaClient) {
    console.info('    Creating static review...');

    // 1. Get Cycle
    const cycle = await prisma.cycle.findFirst({
        where: { title: STATIC_REVIEW_CONFIG.cycleTitle },
    });

    if (!cycle) {
        console.warn(
            `    ⚠️ Cycle "${STATIC_REVIEW_CONFIG.cycleTitle}" not found. Skipping static review.`,
        );
        return;
    }

    // 2. Get Ratee User
    const rateeUser = await prisma.user.findUnique({
        where: { email: STATIC_REVIEW_CONFIG.rateeEmail },
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
            `    ⚠️ User "${STATIC_REVIEW_CONFIG.rateeEmail}" not found. Skipping static review.`,
        );
        return;
    }

    // 3. Get HR User (using Natalya Tkachenko as HR)
    const hrUser = await prisma.user.findUnique({
        where: { email: 'natalya.tkachenko@intra.com' },
    });

    if (!hrUser) {
        console.warn('    ⚠️ HR user not found. Skipping static review.');
        return;
    }

    // 4. Get Ratee Position
    const position = rateeUser.positionId
        ? await prisma.position.findUnique({
              where: { id: rateeUser.positionId },
          })
        : null;

    if (!position) {
        console.warn(
            `    ⚠️ Position for "${STATIC_REVIEW_CONFIG.rateeEmail}" not found. Skipping static review.`,
        );
        return;
    }

    // Prepare Review Data
    const primaryTeam = rateeUser.memberships[0]?.team;

    // Manager details
    let managerFullName: string | null = null;
    let managerPositionId: number | null = null;
    let managerPositionTitle: string | null = null;

    if (rateeUser.managerId) {
        const manager = await prisma.user.findUnique({
            where: { id: rateeUser.managerId },
        });
        if (manager) {
            managerFullName =
                manager.fullName || `${manager.firstName} ${manager.lastName}`;
            if (manager.positionId) {
                const managerPosition = await prisma.position.findUnique({
                    where: { id: manager.positionId },
                });
                if (managerPosition) {
                    managerPositionId = managerPosition.id;
                    managerPositionTitle = managerPosition.title;
                }
            }
        }
    }

    // 5. Create/Update Review
    // No unique constraint on [rateeId, cycleId], so use findFirst
    const existingReview = await prisma.review.findFirst({
        where: {
            rateeId: rateeUser.id,
            cycleId: cycle.id,
        },
    });

    const reviewData = {
        rateeId: rateeUser.id,
        rateeFullName:
            rateeUser.fullName ||
            `${rateeUser.firstName} ${rateeUser.lastName}`,
        rateePositionId: position.id,
        rateePositionTitle: position.title,
        hrId: hrUser.id,
        hrFullName: hrUser.fullName || `${hrUser.firstName} ${hrUser.lastName}`,
        hrNote: STATIC_REVIEW_CONFIG.hrNote,
        teamId: primaryTeam?.id ?? null,
        teamTitle: primaryTeam?.title ?? null,
        managerId: rateeUser.managerId,
        managerFullName,
        managerPositionId,
        managerPositionTitle,
        cycleId: cycle.id,
        stage: STATIC_REVIEW_CONFIG.stage as unknown as PrismaReviewStage,
    };

    let review;
    if (existingReview) {
        review = await prisma.review.update({
            where: { id: existingReview.id },
            data: reviewData,
        });
    } else {
        review = await prisma.review.create({
            data: reviewData,
        });
    }

    console.info(`    ✅ Static Review ID: ${review.id}`);

    // 6. Ensure Questions are linked (ReviewQuestionRelation)
    const cycleQuestions = await prisma.question.findMany({
        where: { cycleId: cycle.id },
        include: { competence: true },
    });

    for (const question of cycleQuestions) {
        await prisma.reviewQuestionRelation.upsert({
            where: {
                reviewId_questionId: {
                    reviewId: review.id,
                    questionId: question.id,
                },
            },
            update: {},
            create: {
                reviewId: review.id,
                questionId: question.id,
                questionTitle: question.title,
                answerType: question.answerType,
                competenceId: question.competenceId!, // Assuming generic questions have competence
                competenceTitle: question.competence?.title || '',
                isForSelfassessment: question.isForSelfassessment,
            },
        });
    }

    // 7. Upsert Respondents
    const invitedAt = new Date('2026-01-16T10:00:00Z');
    const respondedAt = new Date('2026-01-20T15:30:00Z');

    // Clear existing answers to prevent duplicates/overwrites since we are seeding static data
    // and multiple respondents per category exist (which can't be distinguished by unique constraint on Answer table)
    await prisma.answer.deleteMany({
        where: { reviewId: review.id },
    });

    for (const respConfig of STATIC_REVIEW_CONFIG.respondents) {
        const respUser = await prisma.user.findUnique({
            where: { email: respConfig.email },
            include: {
                memberships: {
                    where: { isPrimary: true },
                    include: { team: true },
                },
            },
        });

        if (!respUser) {
            console.warn(`    ⚠️ Respondent "${respConfig.email}" not found.`);
            continue;
        }

        const respPosition = respUser.positionId
            ? await prisma.position.findUnique({
                  where: { id: respUser.positionId },
              })
            : null;

        if (!respPosition) {
            console.warn(
                `    ⚠️ Position for respondent "${respConfig.email}" not found.`,
            );
            continue;
        }

        const respTeam = respUser.memberships[0]?.team;

        await prisma.respondent.upsert({
            where: {
                respondentId_reviewId: {
                    respondentId: respUser.id,
                    reviewId: review.id,
                },
            },
            update: {
                category:
                    respConfig.category as unknown as PrismaRespondentCategory,
                responseStatus: 'COMPLETED',
                invitedAt,
                respondedAt,
                // Make sure to update these fields too if they change or are missing
                fullName:
                    respUser.fullName ||
                    `${respUser.firstName} ${respUser.lastName}`,
                positionId: respPosition.id,
                positionTitle: respPosition.title,
                teamId: respTeam?.id ?? null,
                teamTitle: respTeam?.title ?? null,
            },
            create: {
                respondentId: respUser.id,
                reviewId: review.id,
                category:
                    respConfig.category as unknown as PrismaRespondentCategory,
                responseStatus: 'COMPLETED',
                invitedAt,
                respondedAt,
                fullName:
                    respUser.fullName ||
                    `${respUser.firstName} ${respUser.lastName}`,
                positionId: respPosition.id,
                positionTitle: respPosition.title,
                teamId: respTeam?.id ?? null,
                teamTitle: respTeam?.title ?? null,
            },
        });

        // 8. Create Answers for this respondent
        let i = 0;
        for (const question of cycleQuestions) {
            // Determine answer type
            let numericalValue: number | null = null;
            let textValue: string | null = null;

            if (question.answerType === AnswerType.NUMERICAL_SCALE) {
                // Use scores from config if available, otherwise fallback
                if (respConfig.scores && i < respConfig.scores.length) {
                    numericalValue = respConfig.scores[i];
                } else {
                    numericalValue = 4; // Default if array limits reached (safety fallback)
                }
                i++;
            } else {
                textValue = STATIC_REVIEW_CONFIG.textResponse;
            }

            await prisma.answer.create({
                data: {
                    reviewId: review.id,
                    questionId: question.id,
                    respondentCategory:
                        respConfig.category as unknown as PrismaRespondentCategory,
                    numericalValue,
                    textValue,
                    answerType: question.answerType,
                },
            });
        }
    }

    console.info('    ✅ Static review seeded successfully.');
}
