import { PrismaClient } from '@intra/database';
import seedPositions from './contexts/positions';
import seedPositionHierarchy from './contexts/position-hierarchy';
import seedTeams, { TEAM_SEED_DATA, type TeamMap } from './contexts/teams';
import seedUsers from './contexts/identity';
import getDBConfig from '@intra/api/config/database';
import { PrismaPg } from '@prisma/adapter-pg'
import type { UserMap } from './contexts/identity';
import seedLibrary from './contexts/library/index';

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
  console.log('🌱 Start seeding database...');

  const positions = await seedPositions(prisma);
  console.log('💼 Seeded positions.');

  await seedPositionHierarchy(prisma, positions);
  console.log('🏗️ Seeded position hierarchy.');

  const teams = await seedTeams(prisma);
  console.log('👥 Seeded teams.');

  const users = await seedUsers(prisma, positions, teams);
  console.log('👤 Seeded users.');

  await assignTeamHeads(teams, users);
  console.log('🎩 Assigned team heads.');

  await seedLibrary(prisma);
  console.log('📚 Seeded library.');

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

