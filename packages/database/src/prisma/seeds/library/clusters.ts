import type { PrismaClient } from '@intra/database';


const CLUSTER_LEVELS = [
    { lowerBound: 0, upperBound: 1 },
    { lowerBound: 1, upperBound: 2 },
    { lowerBound: 2, upperBound: 3 },
    { lowerBound: 3, upperBound: 4 },
    { lowerBound: 4, upperBound: 5 },
];

const clusterLevels = (employeesCount?: number, minScore?: number, maxScore?: number) => CLUSTER_LEVELS.map((level) => ({
    lowerBound: level.lowerBound,
    upperBound: level.upperBound,
    minScore: minScore ?? level.lowerBound + 0.1,
    maxScore: maxScore ?? level.upperBound - 0.1,
    averageScore: minScore && maxScore ? (minScore + maxScore) / 2 : (level.lowerBound + level.upperBound) / 2,
    employeesCount: employeesCount ?? 1,
}))


export const CLUSTERS_SEED_DATA = [
    { competenceCode: 'LEAD', clusters: clusterLevels(5) },
    { competenceCode: 'COMM', clusters: clusterLevels(6) },
    { competenceCode: 'TECH', clusters: clusterLevels(7) },
    { competenceCode: 'PMGT', clusters: clusterLevels(4) },
    { competenceCode: 'DELIV', clusters: clusterLevels(6) },
    { competenceCode: 'QUAL', clusters: clusterLevels(5) },
    { competenceCode: 'PROD', clusters: clusterLevels(4) },
    { competenceCode: 'CUST', clusters: clusterLevels(3) },
    { competenceCode: 'COLLAB', clusters: clusterLevels(8) },
    { competenceCode: 'STRAT', clusters: clusterLevels(3) },
];

export default async function seedClusters(prisma: PrismaClient) {
    for (const group of CLUSTERS_SEED_DATA) {
        const competence = await prisma.competence.findUnique({ where: { code: group.competenceCode } });
        if (!competence) {
            console.warn(`Competence not found for clusters: ${group.competenceCode}`);
            continue;
        }

        for (const clusterData of group.clusters) {
            const existingCluster = await prisma.cluster.findFirst({
                where: {
                    competenceId: competence.id,
                    minScore: clusterData.minScore,
                    maxScore: clusterData.maxScore
                }
            });

            if (!existingCluster) {
                await prisma.cluster.create({
                    data: {
                        competenceId: competence.id,
                        ...clusterData
                    }
                });
            }
        }
    }
}
