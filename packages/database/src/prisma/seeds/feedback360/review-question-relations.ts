import { PrismaClient } from '@intra/database';
import type { QuestionMap } from './questions';
import type { ReviewMap } from './reviews';

export default async function seedReviewQuestionRelations(
    prisma: PrismaClient,
    reviewMap: ReviewMap,
    questionMap: QuestionMap,
) {
    // For each review, link questions based on the position competences
    for (const [rateeEmail, reviewRef] of reviewMap) {
        const review = await prisma.review.findUnique({
            where: { id: reviewRef.id },
            include: {
                position: {
                    include: {
                        competences: {
                            include: {
                                competence: true,
                            },
                        },
                    },
                },
            },
        });

        if (!review) {
            console.warn(`⚠️ Review for ${rateeEmail} not found`);
            continue;
        }

        // Get competences for this position
        const competenceCodes = review.position.competences
            .map((pc) => pc.competence.code)
            .filter((code): code is string => code !== null);

        // Get all questions for these competences
        const questions = await prisma.question.findMany({
            where: {
                cycleId: review.cycleId,
                competence: {
                    code: {
                        in: competenceCodes,
                    },
                },
            },
            include: {
                competence: true,
            },
        });

        // Create review-question relations
        for (const question of questions) {
            if (!question.competence) continue;

            const existing = await prisma.reviewQuestionRelation.findFirst({
                where: {
                    reviewId: review.id,
                    questionId: question.id,
                },
            });

            if (existing) continue;

            await prisma.reviewQuestionRelation.create({
                data: {
                    reviewId: review.id,
                    questionId: question.id,
                    questionTitle: question.title,
                    answerType: question.answerType,
                    competenceId: question.competence.id,
                    competenceTitle: question.competence.title,
                    isForSelfassessment: question.isForSelfassessment,
                },
            });
        }
    }
}
