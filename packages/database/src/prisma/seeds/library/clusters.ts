import type { PrismaClient } from '@intra/database';

const CLUSTER_LEVELS = [
    {
        lowerBound: 0,
        upperBound: 1,
        title: 'Beginner',
        description: 'Initial level of competence development',
    },
    {
        lowerBound: 1,
        upperBound: 2,
        title: 'Novice',
        description: 'Basic understanding and application',
    },
    {
        lowerBound: 2,
        upperBound: 3,
        title: 'Intermediate',
        description: 'Confident application in standard situations',
    },
    {
        lowerBound: 3,
        upperBound: 4,
        title: 'Advanced',
        description: 'Proficient with ability to handle complex scenarios',
    },
    {
        lowerBound: 4,
        upperBound: 5,
        title: 'Expert',
        description: 'Mastery level with innovative approaches',
    },
];

export const CLUSTERS_SEED_DATA = [
    { competenceCode: 'LEAD' },
    { competenceCode: 'COMM' },
    { competenceCode: 'TECH' },
    { competenceCode: 'PMGT' },
    { competenceCode: 'DELIV' },
    { competenceCode: 'QUAL' },
    { competenceCode: 'PROD' },
    { competenceCode: 'CUST' },
    { competenceCode: 'COLLAB' },
    { competenceCode: 'STRAT' },
];

export default async function seedClusters(prisma: PrismaClient) {
    for (const group of CLUSTERS_SEED_DATA) {
        const competence = await prisma.competence.findUnique({
            where: { code: group.competenceCode },
        });
        if (!competence) {
            console.warn(
                `⚠️  Competence not found for clusters: ${group.competenceCode}`,
            );
            continue;
        }

        for (const level of CLUSTER_LEVELS) {
            const existingCluster = await prisma.cluster.findFirst({
                where: {
                    competenceId: competence.id,
                    lowerBound: level.lowerBound,
                    upperBound: level.upperBound,
                },
            });

            if (!existingCluster) {
                await prisma.cluster.create({
                    data: {
                        competenceId: competence.id,
                        lowerBound: level.lowerBound,
                        upperBound: level.upperBound,
                        title: level.title,
                        description: level.description,
                    },
                });
            }
        }
    }
}
