import { PrismaClient } from '@intra/database';
import type { ReviewMap } from './reviews';
import type { CycleMap } from './cycles';

export default async function seedClusterScores(
    prisma: PrismaClient,
    reviewMap: ReviewMap,
    cycleMap: CycleMap,
) {
    // Get all reviews with their answers
    const reviews = await prisma.review.findMany({
        include: {
            reviewQuestionRelations: {
                include: {
                    question: {
                        include: {
                            competence: true,
                        },
                    },
                    competence: true,
                },
            },
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

        // Calculate average score for each competence
        const competenceScores = new Map<number, number[]>();

        for (const answer of review.answers) {
            const question = await prisma.question.findUnique({
                where: { id: answer.questionId },
                include: { competence: true },
            });

            if (!question?.competence || !answer.numericalValue) continue;

            const scores = competenceScores.get(question.competence.id) || [];
            scores.push(answer.numericalValue);
            competenceScores.set(question.competence.id, scores);
        }

        // For each competence, calculate average and find matching cluster
        for (const [competenceId, scores] of competenceScores) {
            if (scores.length === 0) continue;

            const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

            const competence = competences.find(c => c.id === competenceId);
            if (!competence) continue;

            // Find the cluster that matches this score
            const matchingCluster = competence.clusters.find(cluster =>
                averageScore >= cluster.lowerBound && averageScore <= cluster.upperBound
            );

            if (!matchingCluster) {
                console.warn(`⚠️ No cluster found for competence ${competence.title} with score ${averageScore}`);
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
                    },
                });
            }
        }
    }
}
