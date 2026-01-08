import { PrismaClient } from '@prisma/client';
import seedPositions from './domains/positions';
import seedTeams from './domains/teams';
import seedUsers from './domains/users';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Start seeding database...');

    const positions = await seedPositions(prisma);
    console.log('✅ Seeded positions.');

    const teams = await seedTeams(prisma);
    console.log('✅ Seeded teams.');

    const users = await seedUsers(prisma, positions, teams);
    console.log('✅ Seeded users.');

    console.log('🌱 End seeding database.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

