import { PrismaClient } from '@intra/database';
import { PrismaPg } from '@prisma/adapter-pg';
import seedPositions from './organisation/positions';
import seedPositionHierarchy from './organisation/position-hierarchy';
import seedTeams from './organisation/teams';
import seedUserRoles from './identity/user-roles';
import seedUsers from './identity/users';
import seedTeamHeads from './organisation/team-heads';
import seedClusters from './library/clusters';
import seedCompetences from './library/competences';
import seedQuestionTemplates from './library/question-templates';
import seedQuestionTemplatePositionRelations from './library/question-template-position-relations';

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL ?? null,
    }),
});

async function main() {
    /* Organisation */
    console.info('\n🏢 Organisation seeding:');
    const positions = await seedPositions(prisma);
    console.info('💼 Positions');

    await seedPositionHierarchy(prisma, positions);
    console.info('🏰 Position hierarchy');

    const teams = await seedTeams(prisma);
    console.info('👥 Teams');

    /* Identity */
    console.info('\n🆔 Identity seeding:');
    await seedUserRoles(prisma);
    console.info('🎭 User roles');

    const users = await seedUsers(prisma, positions, teams);
    console.info('👤 Users');

    const teamsWithHeads = await seedTeamHeads(prisma, teams, users);
    console.info('🎩 Assigned team heads');

    /* Library */
    console.info('\n🗂  Library seeding:');
    await seedCompetences(prisma);
    console.info('📚 Competences');

    const questions = await seedQuestionTemplates(prisma);
    console.info('❓ Questions');

    await seedQuestionTemplatePositionRelations(prisma, questions, positions);
    console.info('🔗 Question-position relations');

    await seedClusters(prisma);
    console.info('📊 Clusters');

    /* Feedback360 */
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

