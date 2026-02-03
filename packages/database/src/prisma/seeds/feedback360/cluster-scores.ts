import { PrismaClient } from '@intra/database';
import type { CycleMap } from './cycles';
import type { ReviewMap } from './reviews';

export default async function seedClusterScores(
    prisma: PrismaClient,
    reviewMap: ReviewMap,
    cycleMap: CycleMap,
) {
    // Get all reviews with their answers
    const reviews = await prisma.review.findMany({
        include: {
            answers: {
                where: {
                    answerType: 'NUMERICAL_SCALE',
                },
            },
            ratee: true,
            cycle: true,
        },
    });

    // Get all competences that have clusters
    const competences = await prisma.competence.findMany({
        include: {
            clusters: true,
        },
    });

    for (const review of reviews) {
        if (!review.cycle) continue;

        // Calculate average score for each competence and count answers
        const competenceData = new Map<number, { scores: number[] }>();

        for (const answer of review.answers) {
            const question = await prisma.question.findUnique({
                where: { id: answer.questionId },
                include: { competence: true },
            });

            if (!question?.competence || !answer.numericalValue) continue;

            const data = competenceData.get(question.competence.id) || {
                scores: [],
            };
            data.scores.push(answer.numericalValue);
            competenceData.set(question.competence.id, data);
        }

        // For each competence, calculate average and find matching cluster
        for (const [competenceId, data] of competenceData) {
            const { scores } = data;
            if (scores.length === 0) continue;

            const averageScore =
                scores.reduce((a, b) => a + b, 0) / scores.length;
            const answersCount = scores.length; // Count total answers instead of unique evaluators

            const competence = competences.find((c) => c.id === competenceId);
            if (!competence) continue;

            // Find the cluster that matches this score
            const matchingCluster = competence.clusters.find(
                (cluster) =>
                    averageScore >= cluster.lowerBound &&
                    averageScore <= cluster.upperBound,
            );

            if (!matchingCluster) {
                console.warn(
                    `⚠️ No cluster found for competence ${competence.title} with score ${averageScore}`,
                );
                continue;
            }

            // Check if cluster score already exists
            const existing = await prisma.clusterScore.findUnique({
                where: {
                    clusterId_rateeId: {
                        clusterId: matchingCluster.id,
                        rateeId: review.rateeId,
                    },
                },
            });

            if (existing) {
                // Update existing cluster score
                await prisma.clusterScore.update({
                    where: { id: existing.id },
                    data: {
                        score: averageScore,
                        answersCount,
                        cycleId: review.cycleId,
                        reviewId: review.id,
                    },
                });
            } else {
                // Create new cluster score
                await prisma.clusterScore.create({
                    data: {
                        cycleId: review.cycleId,
                        clusterId: matchingCluster.id,
                        rateeId: review.rateeId,
                        reviewId: review.id,
                        score: averageScore,
                        answersCount,
                    },
                });
            }
        }
    }
}
