import type { PrismaClient } from '@intra/database';
import { COMPETENCES_SEED_DATA } from './data';

export async function seedClusters(prisma: PrismaClient) {
    console.log('📊 Seeding clusters...');
    for (const c of COMPETENCES_SEED_DATA) {
        const competence = await prisma.competence.findUnique({ where: { title: c.title } });
        if (!competence) continue;

        const existingCluster = await prisma.cluster.findFirst({
            where: {
                competenceId: competence.id,
                minScore: 1,
                maxScore: 5
            }
        });

        if (!existingCluster) {
            await prisma.cluster.create({
                data: {
                    competenceId: competence.id,
                    lowerBound: 0,
                    upperBound: 5,
                    minScore: 1,
                    maxScore: 5,
                    averageScore: 3.5,
                    employeesCount: 10
                }
            });
        }
    }
}
