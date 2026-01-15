import { PrismaClient } from '@intra/database';
import seedPositions from './contexts/positions';
import seedTeams, { TEAM_SEED_DATA, type TeamMap } from './contexts/teams';
import seedUsers from './contexts/identity';
// import getDBConfig from '@intra/api/src/config/database';
import { PrismaPg } from '@prisma/adapter-pg'
import type { UserMap } from './contexts/identity';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    // connectionString: getDBConfig()?.database?.url ?? null,
    connectionString: process.env.DATABASE_URL ?? null,
  }),
});

// const prisma = new PrismaClient();

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

  const teams = await seedTeams(prisma);
  console.log('👥 Seeded teams.');

  const users = await seedUsers(prisma, positions, teams);
  console.log('👤 Seeded users.');

  await assignTeamHeads(teams, users);
  console.log('🎩 Assigned team heads.');

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

