import { PrismaClient } from '@intra/database';
import type { ReviewMap } from './reviews';

export default async function seedReviewQuestionRelations(
    prisma: PrismaClient,
    reviewMap: ReviewMap,
) {
    for (const [rateeEmail, reviewRef] of reviewMap) {
        const review = await prisma.review.findUnique({
            where: { id: reviewRef.id },
        });

        if (!review) {
            console.warn(`⚠️ Review for ${rateeEmail} not found`);
            continue;
        }

        const questions = await prisma.question.findMany({
            where: {
                cycleId: review.cycleId,
            },
            include: {
                competence: true,
            },
        });

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
