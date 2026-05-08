import { PrismaClient } from '@intra/database';
import { PrismaPg } from '@prisma/adapter-pg';
import seedAnswers from './feedback360/answers';
import seedCycles from './feedback360/cycles';
import seedQuestions from './feedback360/questions';
import seedRespondents from './feedback360/respondents';
import seedReviewQuestionRelations from './feedback360/review-question-relations';
import seedReviewers from './feedback360/reviewers';
import seedReviews from './feedback360/reviews';
import seedStaticReview from './feedback360/static-review';
import seedUserRoles from './identity/user-roles';
import seedUsers from './identity/users';
import seedClusters from './library/clusters';
import seedCompetenceQuestionTemplateRelations from './library/competence-question-template-relations';
import seedCompetences from './library/competences';
import seedPositionCompetenceRelations from './library/position-competence-relations';
import seedPositionQuestionTemplateRelations from './library/position-question-template-relations';
import seedQuestionTemplates from './library/question-templates';
import seedPositionHierarchy from './organisation/position-hierarchy';
import seedPositions from './organisation/positions';
import seedTeamHeads from './organisation/team-heads';
import seedTeams from './organisation/teams';
import seedIndividualReports from './reporting/individual-reports';
import seedReportComments from './reporting/report-comments';
import seedStrategicReports from './reporting/startegic-reports';

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

    await seedPositionQuestionTemplateRelations(
        prisma,
        questionTemplates,
        positions,
    );
    console.info('🔗 Question template-position relations');

    await seedClusters(prisma);
    console.info('📊 Clusters');

    /* Feedback360 */
    console.info('\n🎯 Feedback360 seeding:');
    const cycles = await seedCycles(prisma, users);
    console.info('🔄 Cycles');

    const reviews = await seedReviews(prisma, users, cycles);
    console.info('📝 Reviews');

    await seedQuestions(prisma, cycles);
    console.info('❓ Cycle questions');

    await seedReviewQuestionRelations(prisma, reviews);
    console.info('🔗 Review-question relations');

    await seedRespondents(prisma, reviews, users);
    console.info('👥 Respondents');

    await seedReviewers(prisma, reviews, users);
    console.info('👁️  Reviewers');

    await seedAnswers(prisma, reviews);
    console.info('💬 Answers');

    /* Reporting */
    console.info('\n📊 Reporting seeding:');
    await seedIndividualReports();
    console.info('📄 Individual reports');

    await seedStrategicReports();
    console.info('📈 Strategic reports');

    await seedReportComments(prisma);
    console.info('🗒️  Report comments');

    // await seedClusterScores(prisma, reviews, cycles);
    // console.info('📊 Cluster scores');

    // await seedClusterScoreAnalytics(prisma, reviews, cycles);
    // console.info('📈 Cluster score analytics');

    await seedStaticReview(prisma);
    console.info('🗿 Static review');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
