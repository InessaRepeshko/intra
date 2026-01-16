import type { PrismaClient } from '@intra/database';
import { seedCompetences } from './competences';
import { seedQuestions } from './questions';
import { seedClusters } from './clusters';

export default async function seedLibrary(prisma: PrismaClient) {
    console.log('📚 Seeding library context...');
    await seedCompetences(prisma);
    await seedQuestions(prisma);
    await seedClusters(prisma);
    console.log('✅ Library context seeded.');
}
