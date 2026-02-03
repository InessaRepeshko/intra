import { PrismaClient } from '@intra/database';
import type { CycleMap } from './cycles';
import type { ReviewMap } from './reviews';

export default async function seedClusterScoreAnalytics(
    prisma: PrismaClient,
    reviewMap: ReviewMap,
    cycleMap: CycleMap,
) {
    // console.log('🔄 Seeding Cycle Cluster Analytics...');

    // Get all clusters (library templates)
    const clusters = await prisma.cluster.findMany({
        include: {
            competence: true,
        },
    });

    // Get all cycles
    const cycles = await prisma.cycle.findMany();

    for (const cycle of cycles) {
        // Get all reviews for this cycle
        const reviews = await prisma.review.findMany({
            where: { cycleId: cycle.id },
            include: {
                answers: {
                    where: {
                        answerType: 'NUMERICAL_SCALE',
                    },
                },
            },
        });

        // For each cluster, calculate analytics for this cycle
        for (const cluster of clusters) {
            // Find all cluster scores for this cluster in this cycle
            const clusterScores = await prisma.clusterScore.findMany({
                where: {
                    cycleId: cycle.id,
                    clusterId: cluster.id,
                },
            });

            if (clusterScores.length === 0) continue;

            const scores = clusterScores.map((cs) => cs.score);
            const minScore = Math.min(...scores);
            const maxScore = Math.max(...scores);
            const averageScore =
                scores.reduce((a, b) => a + b, 0) / scores.length;
            const employeesCount = clusterScores.length;

            // Check if analytics already exist
            const existing = await prisma.clusterScoreAnalytics.findUnique({
                where: {
                    cycleId_clusterId: {
                        cycleId: cycle.id,
                        clusterId: cluster.id,
                    },
                },
            });

            if (existing) {
                // Update existing analytics
                await prisma.clusterScoreAnalytics.update({
                    where: { id: existing.id },
                    data: {
                        employeesCount,
                        minScore,
                        maxScore,
                        averageScore,
                    },
                });
                console.log(
                    `✅ Updated analytics for ${cluster.competence.code} (${cluster.lowerBound}-${cluster.upperBound}) in cycle "${cycle.title}": ${employeesCount} employees`,
                );
            } else {
                // Create new analytics
                await prisma.clusterScoreAnalytics.create({
                    data: {
                        cycleId: cycle.id,
                        clusterId: cluster.id,
                        employeesCount,
                        minScore,
                        maxScore,
                        averageScore,
                    },
                });
                // console.log(`✅ Created analytics for ${cluster.competence.code} (${cluster.lowerBound}-${cluster.upperBound}) in cycle "${cycle.title}": ${employeesCount} employees`);
            }
        }
    }

    // console.log('✅ Cycle Cluster Analytics seeded successfully');
}
