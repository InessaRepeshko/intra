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
import seedCompetenceQuestionTemplateRelations from './library/competence-question-template-relations';
import seedPositionCompetenceRelations from './library/position-competence-relations';
import seedPositionQuestionTemplateRelations from './library/position-question-template-relations';
import seedCycles from './feedback360/cycles';
import seedReviews from './feedback360/reviews';
import seedQuestions from './feedback360/questions';
import seedReviewQuestionRelations from './feedback360/review-question-relations';
import seedRespondents from './feedback360/respondents';
import seedReviewers from './feedback360/reviewers';
import seedAnswers from './feedback360/answers';
import seedClusterScores from './feedback360/cluster-scores';
import seedCycleClusterAnalytics from './feedback360/cycle-cluster-analytics';

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

    const questionTemplates = await seedQuestionTemplates(prisma);
    console.info('❓ Question templates');

    await seedCompetenceQuestionTemplateRelations(prisma);
    console.info('🔗 Competence-question template relations');

    await seedPositionCompetenceRelations(prisma, positions);
    console.info('🔗 Position-competence relations');

    await seedPositionQuestionTemplateRelations(prisma, questionTemplates, positions);
    console.info('🔗 Question template-position relations');

    await seedClusters(prisma);
    console.info('📊 Clusters');

    /* Feedback360 */
    console.info('\n🎯 Feedback360 seeding:');
    const cycles = await seedCycles(prisma, users);
    console.info('🔄 Cycles');

    const reviews = await seedReviews(prisma, users, cycles);
    console.info('📝 Reviews');

    const questions = await seedQuestions(prisma, cycles);
    console.info('❓ Cycle questions');

    await seedReviewQuestionRelations(prisma, reviews, questions);
    console.info('🔗 Review-question relations');

    await seedRespondents(prisma, reviews, users);
    console.info('👥 Respondents');

    await seedReviewers(prisma, reviews, users);
    console.info('👁️  Reviewers');

    await seedAnswers(prisma, reviews);
    console.info('💬 Answers');

    await seedClusterScores(prisma, reviews, cycles);
    console.info('📊 Cluster scores');

    await seedCycleClusterAnalytics(prisma, reviews, cycles);
    console.info('📈 Cycle cluster analytics');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

