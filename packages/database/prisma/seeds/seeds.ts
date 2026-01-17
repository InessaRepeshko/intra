import { PrismaClient } from '@intra/database';
import seedPositions from './contexts/org-structure/positions';
import seedPositionHierarchy from './contexts/org-structure/position-hierarchy';
import seedTeams, { TEAM_SEED_DATA, type TeamMap } from './contexts/org-structure/teams';
import seedUsers from './contexts/identity/identity';
import getDBConfig from '@intra/api/config/database';
import { PrismaPg } from '@prisma/adapter-pg'
import type { UserMap } from './contexts/identity/identity';
import { seedClusters } from './contexts/library/clusters';
import { seedCompetences } from './contexts/library/competences';
import { seedQuestions } from './contexts/library/questions';
import { seedQuestionPositions } from './contexts/library/question-position';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: getDBConfig()?.database?.url ?? null,
  }),
});

async function assignTeamHeads(
  teamMap: TeamMap,
  userMap: UserMap,
) {
  for (const team of TEAM_SEED_DATA) {
    if (!team.headEmail) continue;

    const teamRecord = teamMap.get(team.title);
    const head = userMap.get(team.headEmail);

    if (!teamRecord || !head) {
      console.warn(`⚠️ Impossible to assign team head for ${team.title}`);
      continue;
    }

    await prisma.team.update({
      where: { id: teamRecord.id },
      data: { headId: head.id },
    });
  }
}

async function main() {
  /* Organizational structure */
  console.log('\n🏢 Org structure seeding:');
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

  await assignTeamHeads(teams, users);
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

