import type { PrismaClient } from '@intra/database';
import { COMPETENCES_SEED_DATA } from './data';

export async function seedCompetences(prisma: PrismaClient) {
    console.log('📚 Seeding competences...');
    for (const c of COMPETENCES_SEED_DATA) {
        await prisma.competence.upsert({
            where: { title: c.title },
            update: {},
            create: {
                code: c.code,
                title: c.title,
                description: c.description,
            },
        });
    }
}
