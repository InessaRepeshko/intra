import { PrismaClient } from '@intra/database';
import { PrismaPg } from '@prisma/adapter-pg';
import seedPositions from './contexts/organisation/positions';
import seedPositionHierarchy from './contexts/organisation/position-hierarchy';
import seedTeams from './contexts/organisation/teams';
import seedUsers from './contexts/identity/identity';
import seedTeamHeads from './contexts/organisation/team-heads';
import seedClusters from './contexts/library/clusters';
import seedCompetences from './contexts/library/competences';
import seedQuestions from './contexts/library/questions';
import seedQuestionPositions from './contexts/library/question-position';

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL ?? null,
    }),
});

async function main() {
    /* Organisation */
    console.log('\n🏢 Organisation seeding:');
    const positions = await seedPositions(prisma);
    console.log('💼 Positions');

    await seedPositionHierarchy(prisma, positions);
    console.log('🏰 Position hierarchy');

    const teams = await seedTeams(prisma);
    console.log('👥 Teams');

    /* Identity */
    console.log('\n🆔 Identity seeding:');
    const users = await seedUsers(prisma, positions, teams);
    console.log('👤 Users');

    const teamsWithHeads = await seedTeamHeads(prisma, teams, users);
    console.log('🎩 Assigned team heads');

    /* Library */
    console.log('\n🗂  Library seeding:');
    await seedCompetences(prisma);
    console.log('📚 Competences');

    const questions = await seedQuestions(prisma);
    console.log('❓ Questions');

    await seedQuestionPositions(prisma, questions, positions);
    console.log('🔗 Question-position relations');

    await seedClusters(prisma);
    console.log('📊 Clusters');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

